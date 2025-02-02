from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from datetime import datetime

class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(db: Session, user: UserCreate):
        db_user = User(
            email=user.email,
            name=user.name,
            picture=user.picture
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def update_user_login(db: Session, user: User):
        user.last_login = datetime.now()
        db.commit()
        db.refresh(user)
        return user 