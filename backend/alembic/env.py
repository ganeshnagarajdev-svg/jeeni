import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Import Base and User to register models
import sys
import os
sys.path.append(os.getcwd()) # Add module path

from app.db.base_class import Base
from app.models.user import User  # Ensure User is imported
from app.models.product import Product, Category, ProductImage # Ensure Product models are imported
from app.models.wishlist import Wishlist # Ensure Wishlist model is imported
from app.models.content import Blog, Media # Ensure Content models are imported
from app.models.general import Career, Page # Ensure General models are imported
from app.models.cart import CartItem # Ensure Cart model is imported
from app.models.order import Order, OrderItem # Ensure Order models are imported
from app.core.config import settings

config = context.config

# Overwrite sqlalchemy.url with the one from settings
config.set_main_option("sqlalchemy.url", settings.SQLALCHEMY_DATABASE_URI)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
