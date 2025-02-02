from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Use the new ConfigDict style
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )
    
    # Google API settings
    GOOGLE_API_KEY: str
    GOOGLE_SEARCH_ENGINE_ID: str
    
    # Default values for testing
    DEFAULT_TEAM: str = "New York Yankees"
    DEFAULT_PLAYER: str = "Aaron Judge"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings() 