from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict
from ...services.content_service import PlayerContentService
from ...core.config import settings

router = APIRouter()
content_service = PlayerContentService()

@router.get("/images/{team}/{player}")
async def get_player_images(team: str, player: str):
    """Get Getty Images embeds for a player"""
    images = content_service.get_player_images(team, player)
    if not images:
        raise HTTPException(status_code=404, detail="Player images not found")
    return {"images": images}

@router.get("/news/{player}")
async def get_player_news(
    player: str,
    limit: Optional[int] = Query(10, ge=1, le=50)
):
    """Get news about a player"""
    news = content_service.get_player_news(player, limit)
    return {"news": news}

@router.get("/search/news")
async def search_news(
    query: str = Query(..., description="Search query string"),
    limit: Optional[int] = Query(10, ge=1, le=100)
) -> List[Dict]:
    """
    Search news with a custom query
    """
    return content_service.search_news(query, limit=limit)

@router.get("/videos/{player}")
async def get_player_videos(
    player: str,
    max_results: Optional[int] = Query(10, ge=1, le=50),
    min_duration: Optional[int] = Query(60, ge=0),
    max_duration: Optional[int] = Query(1200, ge=0)
):
    """Get YouTube videos about a player"""
    videos = content_service.get_player_videos(
        player,
        max_results=max_results,
        min_duration=min_duration,
        max_duration=max_duration
    )
    return {"videos": videos}

@router.get("/videos/{player}/homeruns")
async def get_player_hr_videos(player: str):
    """Get MLB home run videos for a player"""
    videos = content_service.get_player_hr_videos(player)
    if not videos:
        raise HTTPException(status_code=404, detail="No home run videos found for player")
    return {"videos": videos}

@router.get("/search/videos")
async def search_videos(
    query: str = Query(..., description="Search query string"),
    max_results: Optional[int] = Query(10, ge=1, le=50),
    min_duration: Optional[int] = Query(60, ge=0),
    max_duration: Optional[int] = Query(1200, ge=0)
) -> List[Dict]:
    """
    Search MLB videos with a custom query
    """
    return content_service.search_videos(
        query,
        max_results=max_results,
        min_duration=min_duration,
        max_duration=max_duration
    )


