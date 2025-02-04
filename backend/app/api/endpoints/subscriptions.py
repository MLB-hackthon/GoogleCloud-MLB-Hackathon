from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription import Subscription, SubscriptionCreate

router = APIRouter()

@router.get("/{user_id}", response_model=Subscription)
def get_subscription(user_id: int, db: Session = Depends(get_db)):
    db_sub = SubscriptionService.get_subscription(db, user_id=user_id)
    if db_sub is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return db_sub

@router.post("/{user_id}", response_model=Subscription)
def update_subscription(
    user_id: int, 
    subscription: SubscriptionCreate,
    db: Session = Depends(get_db)
):
    return SubscriptionService.update_subscription(db, user_id=user_id, subscription=subscription)

@router.delete("/{user_id}")
def delete_subscription(user_id: int, db: Session = Depends(get_db)):
    success = SubscriptionService.delete_subscription(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return {"status": "success"} 