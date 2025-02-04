from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    picture = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan") 