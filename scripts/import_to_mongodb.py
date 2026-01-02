#!/usr/bin/env python3
"""
Import questions to MongoDB
Reads MONGODB_URI from environment or .env.local file
"""
import os
import json
from pathlib import Path
from pymongo import MongoClient

def get_mongodb_uri():
    """Get MongoDB URI from environment"""
    # First try environment variable
    uri = os.getenv("MONGODB_URI")
    if uri:
        return uri
    
    # Try reading from .env.local manually (handles encoding issues)
    env_path = Path(__file__).parent.parent / ".env.local"
    try:
        with open(env_path, 'r', encoding='utf-8-sig') as f:
            for line in f:
                line = line.strip()
                if line.startswith('MONGODB_URI='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    
    return None

def main():
    mongodb_uri = get_mongodb_uri()
    
    if not mongodb_uri:
        print("❌ MONGODB_URI not found in environment or .env.local")
        return
    
    print("=" * 60)
    print("IMPORT QUESTIONS TO MONGODB")
    print("=" * 60)
    
    print("📡 Connecting...")
    client = MongoClient(mongodb_uri)
    
    # Extract DB name from URI or use default
    db_name = mongodb_uri.split("/")[-1].split("?")[0]
    if not db_name:
        db_name = "ProjectAtlas"
    
    db = client[db_name]
    collection = db["questions"]
    
    print(f"📁 Database: {db_name}")
    
    # Load JSON
    json_file = Path(__file__).parent / "output" / "2023" / "ssc_cgl_2023_all.json"
    
    if not json_file.exists():
        print(f"❌ File not found: {json_file}")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"📊 Found {len(questions)} questions")
    
    # Insert
    print("🚀 Inserting...")
    result = collection.insert_many(questions)
    print(f"✅ Inserted {len(result.inserted_ids)} questions")
    
    print("=" * 60)
    print("✅ IMPORT COMPLETE!")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    main()
