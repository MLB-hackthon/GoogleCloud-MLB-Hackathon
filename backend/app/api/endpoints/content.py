from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict
from fastapi import Depends
from app.services.content_service import PlayerContentService
from app.api.dependencies.dependencies import get_content_service

router = APIRouter()

@router.get("/images/{team}/{player}")
async def get_player_images(
    team: str,
    player: str,
    content_service: PlayerContentService = Depends(get_content_service)
):
    """Get Getty Images embeds for a player"""
    images = content_service.get_player_images(team, player)
    if not images:
        raise HTTPException(status_code=404, detail="Player images not found")
    return {"images": images}

@router.get("/news/{player}")
async def get_player_news(
    player: str,
    limit: Optional[int] = Query(10, ge=1, le=50),
    target_language: Optional[str] = None,
    max_chars_title: Optional[int] = Query(None, ge=1),
    max_chars_summary: Optional[int] = Query(None, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get news about a player
    - Optional translation parameters:
        - target_language: Target language for translation
        - max_chars_title: Maximum characters for translated title
        - max_chars_summary: Maximum characters for translated summary
    """
    news = content_service.get_player_news(
        player,
        limit=limit,
        target_language=target_language,
        max_chars_title=max_chars_title,
        max_chars_summary=max_chars_summary
    )
    return {"news": news}

@router.get("/search/news")
async def search_news(
    query: str = Query(..., description="Search query string"),
    limit: Optional[int] = Query(10, ge=1, le=100),
    target_language: Optional[str] = None,
    max_chars_title: Optional[int] = Query(None, ge=1),
    max_chars_summary: Optional[int] = Query(None, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
) -> List[Dict]:
    """
    Search news with a custom query
    - Optional translation parameters:
        - target_language: Target language for translation
        - max_chars_title: Maximum characters for translated title
        - max_chars_summary: Maximum characters for translated summary
    """
    return content_service.search_news(
        query,
        limit=limit,
        target_language=target_language,
        max_chars_title=max_chars_title,
        max_chars_summary=max_chars_summary
    )

@router.get("/videos/{player}")
async def get_player_videos(
    player: str,
    limit: Optional[int] = Query(10, ge=1, le=50),
    min_duration: Optional[int] = Query(60, ge=0),
    max_duration: Optional[int] = Query(1200, ge=0),
    target_language: Optional[str] = None,
    max_chars_title: Optional[int] = Query(None, ge=1),
    max_chars_description: Optional[int] = Query(None, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get YouTube videos about a player
    - Optional translation parameters:
        - target_language: Target language for translation
        - max_chars_title: Maximum characters for translated title
        - max_chars_description: Maximum characters for translated description
    """
    videos = content_service.get_player_videos(
        player,
        limit=limit,
        min_duration=min_duration,
        max_duration=max_duration,
        target_language=target_language,
        max_chars_title=max_chars_title,
        max_chars_description=max_chars_description
    )
    return {"videos": videos}

@router.get("/videos/{player}/homeruns")
async def get_player_hr_videos(
    player: str,
    target_language: Optional[str] = None,
    max_chars_title: Optional[int] = Query(None, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get MLB home run videos for a player
    - Optional translation parameters:
        - target_language: Target language for translation
        - max_chars_title: Maximum characters for translated title
    """
    videos = content_service.get_player_hr_videos(
        player,
        target_language=target_language,
        max_chars_title=max_chars_title
    )
    if not videos:
        raise HTTPException(status_code=404, detail="No home run videos found for player")
    return {"videos": videos}

@router.get("/search/videos")
async def search_videos(
    query: str = Query(..., description="Search query string"),
    limit: Optional[int] = Query(10, ge=1, le=50),
    min_duration: Optional[int] = Query(60, ge=0),
    max_duration: Optional[int] = Query(1200, ge=0),
    target_language: Optional[str] = None,
    max_chars_title: Optional[int] = Query(None, ge=1),
    max_chars_description: Optional[int] = Query(None, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
) -> List[Dict]:
    """
    Search MLB videos with a custom query
    - Optional translation parameters:
        - target_language: Target language for translation
        - max_chars_title: Maximum characters for translated title
        - max_chars_description: Maximum characters for translated description
    """
    return content_service.search_videos(
        query,
        limit=limit,
        min_duration=min_duration,
        max_duration=max_duration,
        target_language=target_language,
        max_chars_title=max_chars_title,
        max_chars_description=max_chars_description
    )


