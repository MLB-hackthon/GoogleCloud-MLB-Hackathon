from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    DB_HOST: str = "34.55.144.7"  # Change back to IP
    DB_PORT: int = 5432
    DB_USER: str = "mlb"
    DB_PASSWORD: str = "mlb"
    DB_NAME: str = "mlb-app"
    
    # Google API settings
    GOOGLE_API_KEY: str
    GOOGLE_SEARCH_ENGINE_ID: str
    GOOGLE_CLIENT_ID: str
    
    # Default values for testing
    DEFAULT_TEAM: str = "New York Yankees"
    DEFAULT_PLAYER: str = "Aaron Judge"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 