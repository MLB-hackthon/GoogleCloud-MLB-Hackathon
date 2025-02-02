from typing import List, Optional, Dict, Any
import requests

class AIAssistant:
    def __init__(self, api_key: str, model_id: str = "gemini-2.0-flash-exp"):
        self.api_key = api_key
        self.model_id = model_id
        self.system_instruction = None
        self.chat_history = []

    def load_system_prompt(self, file_path: str, replacements: Dict[str, str] = None) -> None:
        try:
            with open(file_path, "r") as file:
                self.system_instruction = file.read()
            
            if replacements:
                for key, value in replacements.items():
                    self.system_instruction = self.system_instruction.replace(key, value)
        except FileNotFoundError:
            raise FileNotFoundError(f"System prompt file not found: {file_path}")

    async def send_message(self, message: str):
        # Store message in chat history
        self.chat_history.append({"role": "user", "content": message})
        
        # For now, just echo back the message
        response = f"Received message: {message}"
        self.chat_history.append({"role": "assistant", "content": response})
        
        # Yield the response in a format compatible with your chat endpoint
        yield {"text": response}

    def get_chat_history(self) -> List[Dict[str, Any]]:
        return self.chat_history

    def get_system_prompt(self) -> str:
        return self.system_instruction
