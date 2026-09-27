import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(ROOT_DIR / ".env")
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

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

def get_db_client():
    global _client
    if _client is None:
        _client = MongoClient(
            MONGODB_URI,
            connectTimeoutMS=8000,
            socketTimeoutMS=10000,
            serverSelectionTimeoutMS=8000,
        )
    return _client

def save_screening_record(data: dict) -> str | None:
    """Save a screening record to MongoDB Atlas."""
    try:
        client = get_db_client()
        db = client[DATABASE_NAME]
        record = {
            **data,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        result = db.screenings.insert_one(record)
        return str(result.inserted_id)
    except Exception as exc:
        print(f"[MongoDB Warning] Could not persist to MongoDB Atlas: {exc}")
        return None

def ping_db():
    try:
        client = get_db_client()
        client.admin.command("ping")
        return {"connected": True, "database": DATABASE_NAME}
    except Exception as exc:
        return {"connected": False, "error": str(exc)}
