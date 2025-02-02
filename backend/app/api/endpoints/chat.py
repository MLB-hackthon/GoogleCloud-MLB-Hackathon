from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from typing import Dict, Optional
import json
from fastapi import Depends
from app.services.chat_service import ChatService
from app.api.dependencies.dependencies import get_chat_service

router = APIRouter()

@router.post("/send")
async def send_message(
    message: Dict[str, str],
    user_id: Optional[str] = Header(None, alias="user_id"),
    chat_service: ChatService = Depends(get_chat_service)
):

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    if not message.get("message"):
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Get or create chat session for this user
    assistant = chat_service.get_or_create_session(user_id)

    async def generate():
        sources = []
        search_queries = []
        
        try:
            async for chunk in assistant.send_message_stream(message["message"]):
                if chunk.text:
                    yield f"data: {json.dumps(chunk.text)}\n\n"
                
                if chunk.candidates:
                    candidate = chunk.candidates[0]
                    if (candidate.grounding_metadata and 
                        candidate.grounding_metadata.grounding_chunks):
                        for grounding_chunk in candidate.grounding_metadata.grounding_chunks:
                            if grounding_chunk.web:
                                sources.append({
                                    "title": grounding_chunk.web.title,
                                    "url": grounding_chunk.web.uri
                                })
                    
                    if (candidate.grounding_metadata and 
                        candidate.grounding_metadata.web_search_queries):
                        search_queries = candidate.grounding_metadata.web_search_queries
            
            metadata = {
                "type": "metadata",
                "sources": sources,
                "search_queries": search_queries
            }

            yield f"data: {json.dumps(metadata)}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

@router.delete("/session")
async def end_session(
    user_id: Optional[str] = Header(None, alias="user_id"),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Optional endpoint to explicitly end a chat session"""
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    
    if user_id in chat_service._sessions:
        del chat_service._sessions[user_id]
    
    return {"status": "success", "message": "Session ended"}