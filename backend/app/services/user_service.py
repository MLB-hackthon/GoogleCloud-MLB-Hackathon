from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        logger.debug(f"Searching for user with email: {email}")
        user = db.query(User).filter(User.email == email).first()
        logger.debug(f"Found user: {user}")
        return user

    @staticmethod
    def create_user(db: Session, user: UserCreate):
        logger.info(f"Creating new user: {user.email}")
        db_user = User(**user.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"User created: {db_user.id}")
        return db_user

    @staticmethod
    def update_user_login(db: Session, user: User):
        logger.info(f"Updating last login for user: {user.id}")
        user.last_login = datetime.now()
        db.commit()
        db.refresh(user)
        return user 