from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import func
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
    def get_user_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

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

    @staticmethod
    def upsert_user(db: Session, user_data: UserCreate):
        """Create or update user with full upsert operation"""
        logger.info(f"Upserting user: {user_data.email}")
        
        # PostgreSQL upsert syntax using PG dialect
        stmt = insert(User).values(
            email=user_data.email,
            name=user_data.name,
            picture=user_data.picture,
            last_login=func.now()
        ).on_conflict_do_update(
            index_elements=['email'],
            set_={
                'name': user_data.name,
                'picture': user_data.picture,
                'last_login': func.now()
            }
        ).returning(User)

        result = db.execute(stmt)
        db.commit()
        return result.scalar_one()

    @staticmethod
    def get_all_users(db: Session):
        """Get all users from database"""
        logger.info("Fetching all users")
        return db.query(User).order_by(User.id).all() 