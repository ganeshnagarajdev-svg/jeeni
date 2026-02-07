import json
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis = None
        self.ttl = 300  # 5 minutes default

    async def connect(self):
        try:
            self.redis = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            await self.redis.ping()
            logger.info("Connected to Redis")
        except Exception as e:
            logger.warning(f"Could not connect to Redis: {e}. Caching disabled.")
            self.redis = None

    async def get(self, key: str) -> Optional[Any]:
        if not self.redis:
            return None
        try:
            data = await self.redis.get(key)
            if data:
                return json.loads(data)
        except Exception as e:
            logger.error(f"Cache get error: {e}")
        return None

    async def set(self, key: str, value: Any, ttl: int = None):
        if not self.redis:
            return
        try:
            await self.redis.setex(key, ttl or self.ttl, json.dumps(value))
        except Exception as e:
            logger.error(f"Cache set error: {e}")

    async def delete(self, key: str):
        if not self.redis:
            return
        try:
            await self.redis.delete(key)
        except Exception as e:
            logger.error(f"Cache delete error: {e}")

cache = CacheService()
