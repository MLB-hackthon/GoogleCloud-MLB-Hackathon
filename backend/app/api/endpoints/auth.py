from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.user_service import UserService
from ...schemas.user import UserCreate, User
from google.oauth2 import id_token
from google.auth.transport import requests
from ...core.config import settings
import logging
from pydantic import BaseModel
from typing import List

router = APIRouter()
logger = logging.getLogger(__name__)

class TokenPayload(BaseModel):
    token: str

@router.post("/google", response_model=User)
async def google_auth(
    payload: TokenPayload,
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Auth request received | Env: {settings.ENV} | Client ID: {settings.GOOGLE_CLIENT_ID[:5]}...")
        
        # Extract the token from the Pydantic model
        token = payload.token
        
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            token, 
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        logger.debug(f"Google token verified | Email: {idinfo['email']}")

        # Extract user info
        user_data = UserCreate(
            email=idinfo['email'],
            name=idinfo['name'],
            picture=idinfo.get('picture')
        )

        # Database operation logging
        logger.info(f"Upserting user: {user_data.email}")
        db_user = UserService.upsert_user(db, user_data)
        logger.info(f"User upserted | ID: {db_user.id}")
        
        return db_user

    except ValueError:
        # Invalid token
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception as e:
        logger.error(f"AUTH FAILURE: {str(e)}", exc_info=True)
        raise
    finally:
        db.close()  # Add explicit connection closing 

@router.get("/user/email/{email}", response_model=User)
def get_user_by_email(
    email: str,
    db: Session = Depends(get_db)
):
    user = UserService.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/user/id/{user_id}", response_model=User)
def get_user_by_id(
    user_id: int, 
    db: Session = Depends(get_db)
):
    user = UserService.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user 

@router.get("/users", response_model=List[User])
def get_all_users(
    db: Session = Depends(get_db),
    # In production, you should add authentication/authorization here
    # current_user: User = Depends(get_current_admin_user)
):
    """
    Get all users (Admin only)
    """
    try:
        users = UserService.get_all_users(db)
        return users
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving users") 