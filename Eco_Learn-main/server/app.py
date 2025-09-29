import os
import json
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Add server directory to path for local imports
import sys
import os
sys.path.append(os.path.dirname(__file__))
from utils.image_hash import compute_combined_hash, is_duplicate

# FastAPI application setup
app = FastAPI(title="Eco Learn Challenge Proof API", version="1.0.0")

# Allow local dev frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo simplicity; tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_DIR = os.path.join(BASE_DIR, 'storage')
UPLOAD_ROOT = os.path.join(BASE_DIR, 'uploads')
HASH_FILE = os.path.join(STORAGE_DIR, 'hashes.json')

os.makedirs(STORAGE_DIR, exist_ok=True)
os.makedirs(UPLOAD_ROOT, exist_ok=True)

# Mount uploads as static for direct access (demo only; protect in production)
app.mount('/uploads', StaticFiles(directory=UPLOAD_ROOT), name='uploads')

# Initialize hash file if missing
if not os.path.exists(HASH_FILE):
    with open(HASH_FILE, 'w', encoding='utf-8') as f:
        json.dump({"students": {}}, f, indent=2)


def load_hash_db():
    with open(HASH_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_hash_db(data):
    with open(HASH_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


def record_relative_path(rel_dir: str, filename: str) -> str:
    """Build a normalized relative path fragment for stored file."""
    return os.path.join(rel_dir, filename).replace('\\', '/')


@app.post("/upload-challenge-proof")
async def upload_challenge_proof(
    student_id: str = Form(...),
    challenge_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Upload endpoint for challenge proof images.
    Process:
      1. Read bytes, compute perceptual hashes.
      2. Compare with existing for that student (any challenge) using Hamming distance <= 5.
      3. If duplicate -> reject.
      4. Else save file under uploads/<student_id>/challenge_<challenge_id>/timestamp_filename
      5. Record hash & metadata in hashes.json
    """
    # Basic content-type guard
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

    # Not duplicate -> persist
    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')
    safe_name = file.filename.replace(' ', '_')
    rel_dir = os.path.join(student_id, f"challenge_{challenge_id}")
    abs_dir = os.path.join(UPLOAD_ROOT, rel_dir)
    os.makedirs(abs_dir, exist_ok=True)
    stored_filename = f"{timestamp}_{safe_name}"
    abs_path = os.path.join(abs_dir, stored_filename)
    with open(abs_path, 'wb') as out:
        out.write(contents)

    rel_path_norm = record_relative_path(rel_dir, stored_filename)
    public_url = f"/uploads/{rel_path_norm}"
    record = {
        "challenge_id": challenge_id,
        "filename": stored_filename,
        "relative_path": rel_path_norm,
        "url": public_url,
        "uploaded_at": timestamp,
        "hash": new_hash
    }
    student_entry['images'].append(record)
    save_hash_db(db)

    return {"success": True, "record": record}


@app.get("/student/{student_id}/images")
async def list_student_images(student_id: str):
    """List stored image metadata for a student (no image bytes)."""
    db = load_hash_db()
    images = db.get('students', {}).get(student_id, {}).get('images', [])
    return {"images": images}


@app.get("/health")
async def health():
    return {"status": "ok"}


# For local development with: uvicorn server.app:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.app:app", host="0.0.0.0", port=8000, reload=True)
