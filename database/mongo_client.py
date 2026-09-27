import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

try:
    import certifi
    CA_FILE = certifi.where()
except ImportError:
    CA_FILE = None

# Load environment variables
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR / "backend" / ".env")

DEFAULT_URI = (
    "mongodb://bbvats777_db_user:tRM8ZJgO8dETKIyu@"
    "ac-7xwkgr5-shard-00-00.rqpvxw3.mongodb.net:27017,"
    "ac-7xwkgr5-shard-00-01.rqpvxw3.mongodb.net:27017,"
    "ac-7xwkgr5-shard-00-02.rqpvxw3.mongodb.net:27017/"
    "?ssl=true&replicaSet=atlas-krrgob-shard-0&authSource=admin&appName=Cluster0&compressors=zlib"
)

MONGODB_URI = os.getenv("MONGODB_URI", DEFAULT_URI)
DATABASE_NAME = os.getenv("DATABASE_NAME", "dr_screening_db")

_client = None

def get_mongo_client() -> MongoClient:
    """Returns a singleton PyMongo MongoClient instance."""
    global _client
    if _client is None:
        client_kwargs = {
            "connectTimeoutMS": 10000,
            "socketTimeoutMS": 15000,
            "serverSelectionTimeoutMS": 8000,
        }
        if CA_FILE:
            client_kwargs["tlsCAFile"] = CA_FILE

        try:
            _client = MongoClient(MONGODB_URI, **client_kwargs)
        except Exception:
            _client = MongoClient(MONGODB_URI)
    return _client

def get_database():
    """Returns the primary DR screening database."""
    client = get_mongo_client()
    return client[DATABASE_NAME]

def get_collection(name: str):
    """Returns a specific collection from the DR screening database."""
    db = get_database()
    return db[name]

def ping_database() -> dict:
    """Pings the MongoDB server to verify active connection."""
    client = get_mongo_client()
    try:
        client.admin.command("ping")
        return {"status": "success", "message": "Connected successfully to MongoDB Atlas"}
    except Exception as e:
        return {"status": "error", "message": f"Connection failed: {str(e)}"}

if __name__ == "__main__":
    print("Testing MongoDB Atlas connection...")
    result = ping_database()
    print("Ping result:", result)
