from typing import Dict
import os
from pathlib import Path
from app.core.ai_assistant import AIAssistant
from app.core.config import settings

class ChatService:
    def __init__(self):
        # Store chat sessions by user_id
        self._sessions: Dict[str, AIAssistant] = {}
    
    def get_or_create_session(self, user_id: str) -> AIAssistant:
        """Get existing chat session or create new one for user"""
        if user_id not in self._sessions:
            # Create new session
            assistant = AIAssistant(api_key=settings.GOOGLE_API_KEY)
            # Get absolute path to the prompt file
            current_dir = Path(__file__).parent
            prompt_path = current_dir.parent / "prompts" / "assistant_prompt.txt"
            
            # Load and configure the system prompt
            assistant.load_system_prompt(
                str(prompt_path),
                replacements={"##PLAYERS##": settings.DEFAULT_PLAYER, "##TEAMS##": settings.DEFAULT_TEAM}
            )
            # Initialize the chat session
            assistant.initialize_chat(temperature=0.5, enable_google_search=True)
            self._sessions[user_id] = assistant
            
        return self._sessions[user_id]

        