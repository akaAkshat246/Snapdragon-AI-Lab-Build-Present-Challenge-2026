import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

uri = os.getenv(
    "MONGODB_URI",
    "mongodb://bbvats777_db_user:tRM8ZJgO8dETKIyu@ac-7xwkgr5-shard-00-00.rqpvxw3.mongodb.net:27017,ac-7xwkgr5-shard-00-01.rqpvxw3.mongodb.net:27017,ac-7xwkgr5-shard-00-02.rqpvxw3.mongodb.net:27017/?ssl=true&replicaSet=atlas-krrgob-shard-0&authSource=admin&appName=Cluster0&compressors=zlib"
)

client = MongoClient(uri)
try:
    client.admin.command("ping")
    print("Connected successfully")
    client.close()
except Exception as e:
    raise Exception("The following error occurred: ", e)
