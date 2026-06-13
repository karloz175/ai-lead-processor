from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str
    database_url: str = "sqlite:///./leads.db"
    telegram_bot_token: str

    class Config:
        env_file = ".env"


settings = Settings()
