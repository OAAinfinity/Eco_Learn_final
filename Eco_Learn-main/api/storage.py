# Shared storage utilities for Vercel serverless functions
import json
import os
from datetime import datetime

# Use /tmp for temporary storage in Vercel
STORAGE_DIR = '/tmp'
HASH_FILE = os.path.join(STORAGE_DIR, 'hash_storage.json')

def ensure_storage():
    """Ensure storage directory and file exist"""
    os.makedirs(STORAGE_DIR, exist_ok=True)
    if not os.path.exists(HASH_FILE):
        with open(HASH_FILE, 'w') as f:
            json.dump({}, f)

def load_storage():
    """Load the hash storage from file"""
    ensure_storage()
    try:
        with open(HASH_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_storage(data):
    """Save the hash storage to file"""
    ensure_storage()
    with open(HASH_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def add_student_image(student_id, record):
    """Add an image record for a student"""
    storage = load_storage()
    student_key = f"student_{student_id}"
    
    if student_key not in storage:
        storage[student_key] = []
    
    storage[student_key].append(record)
    save_storage(storage)
    return len(storage[student_key])

def get_student_images(student_id):
    """Get all image records for a student"""
    storage = load_storage()
    student_key = f"student_{student_id}"
    return storage.get(student_key, [])

def get_student_hashes(student_id):
    """Get all hash data for duplicate detection"""
    images = get_student_images(student_id)
    return [img.get('hash', {}) for img in images]