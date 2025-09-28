import os
import json
import tempfile
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .utils.image_hash import compute_combined_hash, is_duplicate

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Eco Learn API is running"}

@app.post("/api/upload-challenge-proof")
async def upload_challenge_proof(
    student_id: str = Form(...),
    challenge_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload challenge proof image"""
    if not file.content_type.startswith('image/'):
        return JSONResponse(status_code=400, content={"error": "Only image uploads are allowed"})

    contents = await file.read()
    try:
        new_hash = compute_combined_hash(contents)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid image file: {e}"})

    db = load_hash_db()
    student_entry = db.setdefault('students', {}).setdefault(student_id, {"images": []})
    existing_hashes = [img['hash'] for img in student_entry['images']]

    if is_duplicate(new_hash, existing_hashes, threshold=5):
        return JSONResponse(status_code=409, content={"error": "Duplicate image detected"})

    # For Vercel, we'll store metadata only (not the actual file for this demo)
    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')
    safe_name = file.filename.replace(' ', '_')
    stored_filename = f"{timestamp}_{safe_name}"
    
    record = {
        "challenge_id": challenge_id,
        "filename": stored_filename,
        "uploaded_at": timestamp,
        "hash": new_hash,
        "file_size": len(contents)
    }
    student_entry['images'].append(record)
    save_hash_db(db)

    return {"success": True, "record": record}

@app.get("/api/student/{student_id}/images")
async def list_student_images(student_id: str):
    """List stored image metadata for a student"""
    db = load_hash_db()
    images = db.get('students', {}).get(student_id, {}).get('images', [])
    return {"images": images}

# Handler for Vercel
def handler(request):
    return app(request)