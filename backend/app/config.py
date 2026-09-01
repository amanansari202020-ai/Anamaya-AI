# Backend Configuration

import os
from functools import lru_cache
from typing import Any, Union
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application Settings"""

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./healthsphere.db")
    ECHO_SQL: bool = bool(os.getenv("ECHO_SQL", False))

    # JWT & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # API Configuration
    API_TITLE: str = "HealthSphere AI API"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = bool(os.getenv("DEBUG", True))

    # External APIs
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")

    # App Settings
    CORS_ORIGINS: Union[str, list[str]] = (
        "http://localhost:3000,"
        "http://localhost:8081,"
        "http://localhost:8002,"
        "http://127.0.0.1:8002,"
        "http://192.168.0.113:8002"
    )
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5MB

    class Config:
        env_file = ".env"

    @property
    def cors_origins_list(self) -> list[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        return self.CORS_ORIGINS


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
