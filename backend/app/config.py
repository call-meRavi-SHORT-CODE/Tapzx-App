from decouple import config
from typing import Optional

class Settings:
    # Database settings
    MONGODB_URL: str = config("MONGODB_URL", default="mongodb://localhost:27017")
    DATABASE_NAME: str = config("DATABASE_NAME", default="tapzx_db")
    
    # JWT settings
    SECRET_KEY: str = config("SECRET_KEY", default="your-secret-key-here")
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30, cast=int)
    
    # Server settings
    HOST: str = config("HOST", default="0.0.0.0")
    PORT: int = config("PORT", default=8000, cast=int)
    DEBUG: bool = config("DEBUG", default=True, cast=bool)

settings = Settings()