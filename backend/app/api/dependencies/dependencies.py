from fastapi import Depends
from app.services.content_service import PlayerContentService
from app.services.chat_service import ChatService

# Create singleton instances
_content_service: PlayerContentService = None
_chat_service: ChatService = None

def get_content_service() -> PlayerContentService:
    """Dependency to get the content service instance"""
    global _content_service
    if _content_service is None:
        _content_service = PlayerContentService()
    return _content_service

def get_chat_service() -> ChatService:
    """Dependency to get the chat service instance"""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service 