from app.services.content_service import PlayerContentService
from app.services.chat_service import ChatService
from app.services.info_service import PlayerInfoService

# Create singleton instances
_content_service: PlayerContentService = None
_chat_service: ChatService = None
_info_service: PlayerInfoService = None

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

def get_info_service() -> PlayerInfoService:
    """Dependency to get the info service instance"""
    global _info_service
    if _info_service is None:
        _info_service = PlayerInfoService()
    return _info_service 