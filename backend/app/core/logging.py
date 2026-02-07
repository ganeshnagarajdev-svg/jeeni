import logging
import sys
from app.core.config import settings

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Disable uvicorn access logger to avoid duplicate logs if needed
    # logging.getLogger("uvicorn.access").handlers = []

    return logger

logger = setup_logging()
