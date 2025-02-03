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
    max_chars_title_en: Optional[int] = Query(50, ge=1),
    max_chars_title_ja: Optional[int] = Query(30, ge=1),
    max_chars_title_es: Optional[int] = Query(45, ge=1),
    max_chars_summary_en: Optional[int] = Query(50, ge=1),
    max_chars_summary_ja: Optional[int] = Query(65, ge=1),
    max_chars_summary_es: Optional[int] = Query(65, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get news about a player
    - Translation parameters for title and summary in English, Japanese, and Spanish
    - Configurable maximum characters for each language
    """
    news = await content_service.get_player_news(
        player,
        limit=limit,
        max_chars_title_en=max_chars_title_en,
        max_chars_title_ja=max_chars_title_ja,
        max_chars_title_es=max_chars_title_es,
        max_chars_summary_en=max_chars_summary_en,
        max_chars_summary_ja=max_chars_summary_ja,
        max_chars_summary_es=max_chars_summary_es
    )
    return {"news": news}

@router.get("/search/news")
async def search_news(
    query: str = Query(..., description="Search query string"),
    limit: Optional[int] = Query(10, ge=1, le=100),
    max_chars_title_en: Optional[int] = Query(50, ge=1),
    max_chars_title_ja: Optional[int] = Query(30, ge=1),
    max_chars_title_es: Optional[int] = Query(45, ge=1),
    max_chars_summary_en: Optional[int] = Query(50, ge=1),
    max_chars_summary_ja: Optional[int] = Query(65, ge=1),
    max_chars_summary_es: Optional[int] = Query(65, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
) -> List[Dict]:
    """
    Search news with a custom query
    - Translation parameters for title and summary in English, Japanese, and Spanish
    - Configurable maximum characters for each language
    """
    return await content_service.search_news(
        query,
        limit=limit,
        max_chars_title_en=max_chars_title_en,
        max_chars_title_ja=max_chars_title_ja,
        max_chars_title_es=max_chars_title_es,
        max_chars_summary_en=max_chars_summary_en,
        max_chars_summary_ja=max_chars_summary_ja,
        max_chars_summary_es=max_chars_summary_es
    )

@router.get("/videos/{player}")
async def get_player_videos(
    player: str,
    limit: Optional[int] = Query(10, ge=1, le=50),
    min_duration: Optional[int] = Query(60, ge=0),
    max_duration: Optional[int] = Query(1200, ge=0),
    max_chars_title_en: Optional[int] = Query(50, ge=1),
    max_chars_title_ja: Optional[int] = Query(30, ge=1),
    max_chars_title_es: Optional[int] = Query(45, ge=1),
    max_chars_description_en: Optional[int] = Query(50, ge=1),
    max_chars_description_ja: Optional[int] = Query(65, ge=1),
    max_chars_description_es: Optional[int] = Query(65, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get YouTube videos about a player
    - Translation parameters for title and description in English, Japanese, and Spanish
    - Configurable maximum characters for each language
    """
    videos = await content_service.get_player_videos(
        player,
        limit=limit,
        min_duration=min_duration,
        max_duration=max_duration,
        max_chars_title_en=max_chars_title_en,
        max_chars_title_ja=max_chars_title_ja,
        max_chars_title_es=max_chars_title_es,
        max_chars_description_en=max_chars_description_en,
        max_chars_description_ja=max_chars_description_ja,
        max_chars_description_es=max_chars_description_es
    )
    return {"videos": videos}

@router.get("/videos/{player}/homeruns")
async def get_player_hr_videos(
    player: str,
    limit: Optional[int] = Query(10, ge=1, le=50),
    max_chars_title_en: Optional[int] = Query(50, ge=1),
    max_chars_title_ja: Optional[int] = Query(30, ge=1),
    max_chars_title_es: Optional[int] = Query(45, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
):
    """
    Get MLB home run videos for a player
    - Translation parameters for title in English, Japanese, and Spanish
    - Configurable maximum characters for each language
    """
    videos = await content_service.get_player_hr_videos(
        player,
        limit=limit,
        max_chars_title_en=max_chars_title_en,
        max_chars_title_ja=max_chars_title_ja,
        max_chars_title_es=max_chars_title_es
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
    max_chars_title_en: Optional[int] = Query(50, ge=1),
    max_chars_title_ja: Optional[int] = Query(30, ge=1),
    max_chars_title_es: Optional[int] = Query(45, ge=1),
    max_chars_description_en: Optional[int] = Query(50, ge=1),
    max_chars_description_ja: Optional[int] = Query(65, ge=1),
    max_chars_description_es: Optional[int] = Query(65, ge=1),
    content_service: PlayerContentService = Depends(get_content_service)
) -> List[Dict]:
    """
    Search MLB videos with a custom query
    - Translation parameters for title and description in English, Japanese, and Spanish
    - Configurable maximum characters for each language
    """
    return await content_service.search_videos(
        query,
        limit=limit,
        min_duration=min_duration,
        max_duration=max_duration,
        max_chars_title_en=max_chars_title_en,
        max_chars_title_ja=max_chars_title_ja,
        max_chars_title_es=max_chars_title_es,
        max_chars_description_en=max_chars_description_en,
        max_chars_description_ja=max_chars_description_ja,
        max_chars_description_es=max_chars_description_es
    )


