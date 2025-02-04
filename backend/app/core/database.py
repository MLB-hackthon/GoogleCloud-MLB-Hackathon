from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
from sqlalchemy.sql import text
import logging
logger = logging.getLogger(__name__)
# Directly use the settings from config
engine = create_engine(
    f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}",
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=8,
    max_overflow=2,
    pool_timeout=10
)

# Test connection immediately
try:
    with engine.connect() as conn:
        print("✅ Successfully connected to PostgreSQL database!")
except Exception as e:
    print(f"❌ Database connection failed: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        # Test connection
        db.execute(text("SELECT 1"))
        logger.info("✅ Database connection successful")
    except Exception as e:
        logger.error(f"❌ Database connection failed: {str(e)}")
    return db 