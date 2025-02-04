from sqlalchemy.orm import Session
from ..models.subscription import Subscription
from ..schemas.subscription import SubscriptionCreate

class SubscriptionService:
    @staticmethod
    def get_subscription(db: Session, user_id: int):
        return db.query(Subscription).filter(Subscription.id == user_id).first()

    @staticmethod
    def update_subscription(db: Session, user_id: int, subscription: SubscriptionCreate):
        db_sub = db.query(Subscription).filter(Subscription.id == user_id).first()
        if not db_sub:
            db_sub = Subscription(id=user_id, **subscription.model_dump())
            db.add(db_sub)
        else:
            for key, value in subscription.model_dump().items():
                setattr(db_sub, key, value)
        db.commit()
        db.refresh(db_sub)
        return db_sub

    @staticmethod
    def delete_subscription(db: Session, user_id: int):
        db_sub = db.query(Subscription).filter(Subscription.id == user_id).first()
        if db_sub:
            db.delete(db_sub)
            db.commit()
            return True
        return False 