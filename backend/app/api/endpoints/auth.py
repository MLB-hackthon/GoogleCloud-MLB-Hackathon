from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.user_service import UserService
from ...schemas.user import UserCreate, User
from google.oauth2 import id_token
from google.auth.transport import requests
from ...core.config import settings
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/google", response_model=User)
async def google_auth(
    token: str,
    db: Session = Depends(get_db)
):
    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )

        # Extract user info
        user_data = UserCreate(
            email=idinfo['email'],
            name=idinfo['name'],
            picture=idinfo.get('picture')
        )

        # Upsert user record
        db_user = UserService.upsert_user(db, user_data)
        
        return db_user

    except ValueError as e:
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed") 