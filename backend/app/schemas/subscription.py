from pydantic import BaseModel
from typing import List

class SubscriptionBase(BaseModel):
    players: List[str] = []
    teams: List[str] = []

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int

    class Config:
        from_attributes = True 