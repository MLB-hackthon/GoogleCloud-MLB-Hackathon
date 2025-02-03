from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict
from app.services.info_service import PlayerInfoService
from app.api.dependencies.dependencies import get_info_service

router = APIRouter()

@router.get("/info/{player}")
async def get_player_info(
    player: str,
    info_service: PlayerInfoService = Depends(get_info_service)
) -> Dict:
    """
    Get detailed player information from MLB Stats API
    """
    player_info = await info_service.get_player_info_by_name(player)
    if not player_info:
        raise HTTPException(status_code=404, detail="Player not found")
    return {"info": player_info}

@router.get("/headshot/{player}")
async def get_player_headshot(
    player: str,
    info_service: PlayerInfoService = Depends(get_info_service)
) -> Dict:
    """
    Get player headshot image URL
    """
    headshot_url = await info_service.get_player_headshot_by_name(player)
    if not headshot_url:
        raise HTTPException(status_code=404, detail="Player headshot not found")
    return {"headshot_url": headshot_url}

@router.get("/team/logo/{team}")
async def get_team_logo(
    team: str,
    info_service: PlayerInfoService = Depends(get_info_service)
) -> Dict:
    """
    Get team logo URL by team name
    """
    logo_url = await info_service.get_team_logo_by_name(team)
    if not logo_url:
        raise HTTPException(status_code=404, detail="Team logo not found")
    return {"logo_url": logo_url}
