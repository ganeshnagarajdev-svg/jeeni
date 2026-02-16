
import pytest
from typing import AsyncGenerator
from httpx import AsyncClient
from app.main import app
from app.core.config import settings

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(autouse=True)
def mock_dependencies(mocker):
    # Mock Cache
    mocker.patch("app.core.cache.cache.connect", return_value=None)
    mocker.patch("app.core.cache.cache.redis", None)
    
    # Mock DB
    mock_session = mocker.AsyncMock()
    mock_session.__aenter__.return_value = mock_session
    mock_session.execute.return_value.scalars.return_value.first.return_value = True # Pretend data exists
    
    mocker.patch("app.db.session.AsyncSessionLocal", return_value=mock_session)
    
    # Mock FastAPILimiter
    mocker.patch("fastapi_limiter.FastAPILimiter.init", return_value=None)

@pytest.fixture(scope="module")
async def client() -> AsyncGenerator:
    # Disable startup event for tests or rely on mocks
    from httpx import ASGITransport
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://localhost") as c:
        yield c
