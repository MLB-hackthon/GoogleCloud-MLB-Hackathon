from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Google API settings
    GOOGLE_API_KEY: str
    GOOGLE_SEARCH_ENGINE_ID: str
    
    # Default values for testing
    DEFAULT_TEAM: str
    DEFAULT_PLAYER: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 