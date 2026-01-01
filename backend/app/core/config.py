class Settings:
    PROJECT_NAME: str = "Backend Intern Assignment API"
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./app.db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    SECRET_KEY: str = "change-me-in-production"  # For demo/assignment only
    ALGORITHM: str = "HS256"


settings = Settings()
