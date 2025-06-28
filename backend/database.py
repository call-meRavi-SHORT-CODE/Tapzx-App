from pymongo import MongoClient
from config import Config
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.client = None
        self.db = None
    
    def connect(self):
        try:
            self.client = MongoClient(Config.MONGO_URI)
            self.db = self.client[Config.DATABASE_NAME]
            
            # Test connection
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
            # Create indexes
            self.create_indexes()
            
        except Exception as e:
            logger.error(f"Error connecting to MongoDB: {e}")
            raise
    
    def create_indexes(self):
        try:
            # Users collection indexes
            self.db.users.create_index("email", unique=True)
            self.db.users.create_index("phone_number", unique=True)
            
            # Profile collection indexes
            self.db.profiles.create_index("username", unique=True)
            self.db.profiles.create_index("user_id", unique=True)
            
            # Links collection indexes
            self.db.links.create_index("user_id", unique=True)
            
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {e}")
    
    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def close(self):
        if self.client:
            self.client.close()
            logger.info("Disconnected from MongoDB")

# Global database instance
database = Database()