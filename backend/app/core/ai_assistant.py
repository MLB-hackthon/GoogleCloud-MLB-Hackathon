from google import genai
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch
from typing import List, Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AIAssistant:
    def __init__(self, api_key: str, model_id: str = "gemini-2.0-flash-exp"):
        """Initialize the AI Assistant with API credentials and configuration."""
        logger.info(f"Initializing AIAssistant with model_id: {model_id}")
        self.api_key = api_key
        self.model_id = model_id
        self.client = genai.Client(api_key=self.api_key)
        self.chat = None
        self.system_instruction = None

    def load_system_prompt(self, file_path: str, replacements: Dict[str, str] = None) -> None:
        """Load and process the system prompt from a file."""
        try:
            with open(file_path, "r") as file:
                self.system_instruction = file.read()
            
            if replacements:
                for key, value in replacements.items():
                    self.system_instruction = self.system_instruction.replace(key, value)
            
            logger.info(f"Loaded system prompt from {file_path}")
        except FileNotFoundError:
            logger.error(f"System prompt file not found: {file_path}")
            raise FileNotFoundError(f"System prompt file not found: {file_path}")

    def initialize_chat(self, enable_google_search: bool = True, streaming: bool = False, temperature: float = 0.5, json_output: bool = False) -> None:
        """Initialize the chat session with specified configuration."""
        if not self.system_instruction:
            raise ValueError("System prompt not loaded. Call load_system_prompt first.")

        logger.info("Initializing chat session")

        google_search_tool = Tool(
            google_search = GoogleSearch()
        )
        
        try:
            config = GenerateContentConfig(
                system_instruction=self.system_instruction,
                temperature=temperature,
                tools=[google_search_tool] if enable_google_search else [],
                response_modalities=["TEXT"],
                response_mime_type="application/json" if json_output else "text/plain",
            )
            
            if streaming:
                self.chat = self.client.aio.chats.create(
                    model=self.model_id,
                    config=config,
                )
            else:
                self.chat = self.client.chats.create(
                    model=self.model_id,
                    config=config,
                )
            logger.info("Chat initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing chat: {str(e)}")
            raise

    async def send_message_stream(self, message: str) -> Dict[str, Any]:
        """Send a message to the AI and return the response with metadata."""
        if not self.chat:
            raise RuntimeError("Chat not initialized. Call initialize_chat first.")

        try:
            response = self.chat.send_message_stream(message)
            return response
        except Exception as e:
            logger.error(f"Error sending message stream: {str(e)}")
            raise

    async def send_message(self, message: str) -> Dict[str, Any]:
        """Send a message to the AI and return the response with metadata."""
        if not self.chat:
            raise RuntimeError("Chat not initialized. Call initialize_chat first.")

        return self.chat.send_message(message)

    def get_chat_history(self) -> List[Dict[str, Any]]:
        """Return the chat history."""
        if not self.chat:
            return []
        return self.chat.history

    def get_system_prompt(self) -> str:
        """Return the system prompt."""
        return self.system_instruction
