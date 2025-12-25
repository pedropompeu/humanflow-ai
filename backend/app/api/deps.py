from typing import AsyncGenerator
from app.db.session import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependência para injeção de sessão do banco de dados em endpoints da API.
    Garante que a sessão seja sempre fechada após o uso.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
