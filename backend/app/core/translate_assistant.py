from typing import Dict, Any, Optional
from .ai_assistant import AIAssistant
import json
import re
from pathlib import Path

from google import genai
from google.genai.types import GenerateContentResponse

class TranslateAssistant:
    def __init__(self, api_key: str):
        """Initialize the Translation Assistant."""
        self.assistant = AIAssistant(api_key, model_id="gemini-1.5-flash")

        # Get absolute path to the prompt file
        current_dir = Path(__file__).parent
        prompt_path = current_dir.parent / "prompts" / "translate_prompt.txt"

        self.assistant.load_system_prompt(str(prompt_path))
        self.assistant.initialize_chat(temperature=0.1, enable_google_search=False, json_output=True)  # Low temperature for consistent translations

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
                    "originalText": "",
                    "translatedEnText": "",
                    "translatedJaText": "",
                    "translatedEsText": ""
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
            "originalText": response_text,
            "translatedEnText": response_text,
            "translatedJaText": response_text,
            "translatedEsText": response_text
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
            # Send the request as a proper JSON-formatted string
            response = await self.assistant.send_message(json.dumps(request))
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