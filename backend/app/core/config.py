from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str
    
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