from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

# Cria a engine de conexão assíncrona com o banco de dados
async_engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    echo=False,  # Mude para True para ver os logs SQL
)

# Cria um factory de sessões assíncronas
AsyncSessionLocal = async_sessionmaker(
    expire_on_commit=False,
    bind=async_engine
)
