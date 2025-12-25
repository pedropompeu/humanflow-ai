import asyncio
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

# Adiciona o diretório pai ao path para conseguir importar o app
sys.path.append(os.getcwd())

# Importa Base de app.db.base
from app.db.base import Base

# Importa Settings de app.core.config
from app.core.config import Settings

# Importa todos os modelos para que Base.metadata seja populado para autogenerate
from app.models import user, repository, analysis

# Carrega as configurações
settings = Settings()

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Define target_metadata = Base.metadata
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    # Carrega a URL do banco das configurações (settings.SQLALCHEMY_DATABASE_URI)
    url = str(settings.SQLALCHEMY_DATABASE_URI)
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """Função auxiliar para executar migrações em contexto assíncrono."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode com suporte assíncrono (asyncio)."""
    # Configure connectable = create_async_engine(...)
    connectable = create_async_engine(
        str(settings.SQLALCHEMY_DATABASE_URI),
        poolclass=pool.NullPool,
    )

    # Roda em contexto assíncrono (do_run_migrations)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    # Execução assíncrona (asyncio)
    asyncio.run(run_migrations_online())
