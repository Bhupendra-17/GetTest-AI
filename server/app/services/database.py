from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client = None
    db = None

    @classmethod
    async def connect(cls):
        cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
        cls.db = cls.client.get_default_database()

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()