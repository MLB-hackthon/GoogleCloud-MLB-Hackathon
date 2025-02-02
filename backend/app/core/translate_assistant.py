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
        self.assistant.initialize_chat(temperature=0.1, enable_google_search=False)  # Low temperature for consistent translations

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
                    "translatedText": "",
                    "characterCount": 0
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
            "translatedText": response_text,
            "characterCount": len(response_text)
        }

    def translate(
        self,
        text: str,
        target_language: str,
        content_type: str,
        max_chars: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Translate text to target language with specified constraints.
        
        Args:
            text: Text to translate
            target_language: Target language code or name
            content_type: Either 'news_title' or 'news_summary'
            max_chars: Maximum characters allowed (optional)
        """
        if not text:
            return {
                "originalText": text,
                "translatedText": text,
                "characterCount": 0
            }

        # Prepare the translation request
        request = {
            "targetLanguage": target_language,
            "text": text,
            "type": content_type,
            "maxCharacters": max_chars if max_chars else len(text) * 2  # Default to 2x original length if not specified
        }

        try:
            # Send the request as JSON string
            response = self.assistant.send_message(str(request))
            # Parse the response
            parsed_response = self._parse_response(response)
            
            # Validate the response format
            if not all(key in parsed_response for key in ["originalText", "translatedText", "characterCount"]):
                raise ValueError("Invalid response format from translation service")
                
            return parsed_response
        except Exception as e:
            print(f"Translation error: {e}")
            return {
                "originalText": text,
                "translatedText": text,
                "characterCount": len(text)
            } 