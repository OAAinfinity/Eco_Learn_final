import os
import json
import tempfile
from datetime import datetime
from fastapi import File, UploadFile, Form
from fastapi.responses import JSONResponse
from .utils.image_hash import compute_combined_hash, is_duplicate

# Use /tmp directory for Vercel serverless functions
TEMP_DIR = "/tmp"
HASH_FILE = os.path.join(TEMP_DIR, "hashes.json")

def ensure_hash_file():
    """Ensure hash file exists"""
    if not os.path.exists(HASH_FILE):
        os.makedirs(os.path.dirname(HASH_FILE), exist_ok=True)
        with open(HASH_FILE, 'w') as f:
            json.dump({"students": {}}, f, indent=2)

def load_hash_db():
    """Load hash database"""
    ensure_hash_file()
    with open(HASH_FILE, 'r') as f:
        return json.load(f)

def save_hash_db(data):
    """Save hash database"""
    ensure_hash_file()
    with open(HASH_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def handler(event, context):
    """Serverless function handler for file upload"""
    import json
    from urllib.parse import parse_qs
    
    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # For demo purposes, return success
    # In production, you'd parse multipart form data here
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        'body': json.dumps({
            'success': True, 
            'message': 'Upload endpoint configured for Vercel'
        })
    }