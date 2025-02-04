from typing import Dict, Any, Optional, List
from .ai_assistant import AIAssistant
import json
import re
from pathlib import Path
import logging
from datetime import datetime
import asyncio
from itertools import islice
from concurrent.futures import ThreadPoolExecutor
from functools import partial

from google import genai
from google.genai.types import GenerateContentResponse

class TranslateAssistant:
    def __init__(self, api_key: str, num_assistants: int = 8):
        """Initialize multiple Translation Assistants for parallel processing."""
        # Set up logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        
        # Create a formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        
        # Create and configure stream handler if none exists
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

        # Initialize multiple assistants
        self.assistants = []
        for i in range(num_assistants):
            assistant = AIAssistant(api_key, model_id="gemini-1.5-flash-8b-latest")
            
            # Get absolute path to the prompt file
            current_dir = Path(__file__).parent
            prompt_path = current_dir.parent / "prompts" / "translate_prompt.txt"

            assistant.load_system_prompt(str(prompt_path))
            assistant.initialize_chat(temperature=0.1, enable_google_search=False, json_output=True)
            self.assistants.append(assistant)

        self.num_assistants = num_assistants
        self.thread_pool = ThreadPoolExecutor(max_workers=num_assistants)

    def _parse_response(self, response: GenerateContentResponse | str) -> Dict[str, Any]:
        """
        Parse the AI response to extract the JSON translation result.
        
        Args:
            response: Raw response from the AI (either string or GenerateContentResponse)
            
        Returns:
            Dictionary containing originalText, translatedText, and characterCount
        """
        # If response is GenerateContentResponse, get text from it
        if isinstance(response, GenerateContentResponse):
            if response.candidates:
                response_text = response.candidates[0].content.parts[0].text
            else:
                # Handle empty response
                return {
                    "error": "No response from translation service"
                }
        else:
            response_text = response

        try:
            # Try to parse the entire response as JSON first
            return json.loads(response_text)
        except json.JSONDecodeError:
            try:
                # Try to extract JSON using regex if direct parsing fails
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    return json.loads(json_match.group(0))
            except (json.JSONDecodeError, AttributeError):
                pass
        
        # If parsing fails, return original text as fallback
        return {
            "error": "Failed to parse translation response"
        }

    async def translate(
        self,
        text: str,
        content_type: str,
        max_chars_en: Optional[int] = None,
        max_chars_ja: Optional[int] = None,
        max_chars_es: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Translate text to multiple languages with specified constraints.
        
        Args:
            text: Text to translate
            content_type: Either 'news_title' or 'news_summary'
            max_chars_en: Maximum characters allowed for English translation
            max_chars_ja: Maximum characters allowed for Japanese translation
            max_chars_es: Maximum characters allowed for Spanish translation
        """
        if not text:
            return {
                "originalText": text,
                "translatedEnText": text,
                "translatedJaText": text,
                "translatedEsText": text,
            }

        # Prepare the translation request
        request = {
            "text": text,
            "type": content_type,
            "maxEnCharacters": max_chars_en if max_chars_en else len(text) * 2,
            "maxJaCharacters": max_chars_ja if max_chars_ja else len(text) * 2,
            "maxEsCharacters": max_chars_es if max_chars_es else len(text) * 2
        }

        try:
            # Log request time
            self.logger.info(f"\tSending translation request for content type: {content_type}")
            
            # Send the request as a proper JSON-formatted string
            response = await self.assistants[0].send_message(json.dumps(request))
            
            # Log response received
            self.logger.info(f"\tReceived translation response for content type: {content_type}")
            
            # Parse the response
            parsed_response = self._parse_response(response)
            
            # Validate the response format
            required_keys = ["originalText", "translatedEnText", "translatedJaText", "translatedEsText"]
            if not all(key in parsed_response for key in required_keys):
                raise ValueError("Invalid response format from translation service")
                
            return parsed_response
        except Exception as e:
            print(f"Translation error: {e}")
            return {
                "originalText": text,
                "translatedEnText": text,
                "translatedJaText": text,
                "translatedEsText": text,
            }

    async def translate_batch(
        self,
        translation_tasks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Translate a batch of texts using multiple assistants concurrently.
        
        Args:
            translation_tasks: List of translation task dictionaries
        """
        if not translation_tasks:
            return {"results": []}

        def process_sub_batch_sync(assistant: AIAssistant, sub_batch: List[Dict[str, Any]], batch_index: int) -> Dict[str, Any]:
            """Synchronous version of process_sub_batch to run in thread pool"""
            batch_request = {
                "translations": [
                    {
                        "id": task["id"],
                        "text": task["text"],
                        "type": task["type"],
                        "maxEnCharacters": task.get("max_chars_en", len(task["text"]) * 2),
                        "maxJaCharacters": task.get("max_chars_ja", len(task["text"]) * 2),
                        "maxEsCharacters": task.get("max_chars_es", len(task["text"]) * 2)
                    }
                    for task in sub_batch
                ]
            }

            try:
                self.logger.info(f"\tAssistant {batch_index} processing sub-batch of {len(sub_batch)} items")
                # Use synchronous version of send_message
                response = assistant.chat.send_message(json.dumps(batch_request))
                parsed_response = self._parse_response(response)
                
                if "error" in parsed_response:
                    return {"error": f"Sub-batch {batch_index} processing failed: {parsed_response['error']}"}
                
                return parsed_response
            except Exception as e:
                return {"error": f"Sub-batch {batch_index} processing failed: {str(e)}"}

        try:
            # Calculate items per sub-batch
            total_items = len(translation_tasks)
            items_per_batch = (total_items + self.num_assistants - 1) // self.num_assistants

            # Split tasks into sub-batches
            sub_batches = [
                translation_tasks[i:i + items_per_batch]
                for i in range(0, total_items, items_per_batch)
            ]

            self.logger.info(f"Split {total_items} tasks into {len(sub_batches)} sub-batches")

            # Create futures for each sub-batch
            futures = []
            for i, batch in enumerate(sub_batches):
                if i < self.num_assistants and batch:
                    future = self.thread_pool.submit(
                        process_sub_batch_sync,
                        self.assistants[i],
                        batch,
                        i
                    )
                    futures.append(future)

            # Wait for all futures to complete
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None,
                lambda: [future.result() for future in futures]
            )

            # Combine results
            combined_results = {}
            for result in results:
                if "error" in result:
                    self.logger.error(f"Error in sub-batch: {result['error']}")
                    continue
                    
                for item in result["results"]:
                    combined_results[item["id"]] = item

            return combined_results

        except Exception as e:
            self.logger.error(f"Batch translation error: {e}")
            return {"error": "Failed to translate batch"}

    def __del__(self):
        """Cleanup thread pool on deletion"""
        self.thread_pool.shutdown(wait=False) 