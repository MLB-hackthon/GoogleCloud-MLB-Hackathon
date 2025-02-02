from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import time

def get_db_url():
    if settings.DB_HOST.startswith('/cloudsql'):
        # Unix socket connection
        return f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@/{settings.DB_NAME}?host={settings.DB_HOST}"
    else:
        # TCP connection
        return f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

def create_db_engine(retries=5):
    for attempt in range(retries):
        try:
            engine = create_engine(
                get_db_url(),
                pool_pre_ping=True,  # Add connection health checks
                pool_recycle=300,    # Recycle connections every 5 minutes
                connect_args={
                    "connect_timeout": 10  # Connection timeout in seconds
                }
            )
            # Test the connection using text()
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                conn.commit()
            return engine
        except Exception as e:
            print(f"Database connection attempt {attempt + 1} failed: {str(e)}")
            if attempt == retries - 1:
                raise e
            time.sleep(5)  # Wait 5 seconds before retrying

# Create engine with retries
engine = create_db_engine()

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 