from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.user_service import UserService
from ...schemas.user import UserCreate, User
from google.oauth2 import id_token
from google.auth.transport import requests
from ...core.config import settings

router = APIRouter()

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

        # Check if user exists
        db_user = UserService.get_user_by_email(db, user_data.email)
        
        if db_user:
            # Update last login
            return UserService.update_user_login(db, db_user)
        else:
            # Create new user
            return UserService.create_user(db, user_data)

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Could not validate credentials: {str(e)}"
        ) 