from fastapi import Request, Response
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import logging

logger = logging.getLogger(__name__)

class SafeRateLimiter(RateLimiter):
    async def __call__(self, request: Request, response: Response):
        if not FastAPILimiter.redis:
            # Redis not connected, skip rate limiting
            return
        
        try:
            await super().__call__(request, response)
        except Exception as e:
            # catch-all for rate limiting errors to prevent partial outages
            logger.error(f"Rate limiting failed: {e}")
