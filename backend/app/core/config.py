import os
from pydantic_settings import BaseSettings
from pydantic import validator
from typing import Optional

class Settings(BaseSettings):
    # --- NOVAS LINHAS NECESSÁRIAS ---
    PROJECT_NAME: str = "HumanFlow AI"
    API_V1_STR: str = "/api/v1"
    # --------------------------------

    # Carrega as variáveis do arquivo .env por padrão
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"
    SECRET_KEY: str
    GOOGLE_API_KEY: str
    
    # Propriedade para montar a URI de conexão assíncrona
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v, values):
        if isinstance(v, str):
            return v
        return (
            f"postgresql+asyncpg://"
            f"{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@"
            f"{values.get('POSTGRES_SERVER')}:{values.get('POSTGRES_PORT')}/"
            f"{values.get('POSTGRES_DB')}"
        )

    class Config:
        case_sensitive = False
        env_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))

settings = Settings()