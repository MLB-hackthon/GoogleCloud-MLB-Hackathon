from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    players = Column(JSON, default=[])
    teams = Column(JSON, default=[])
    
    user = relationship("User", back_populates="subscription", single_parent=True) 