Eco_Learn

## Local Image Proof Upload & Duplicate Detection

This project now includes a lightweight local backend (FastAPI) to support image proof uploads for challenges with perceptual hash duplicate detection.

### Features
- aHash + dHash perceptual hashing (offline) stored in `server/storage/hashes.json`.
- Duplicate detection using Hamming distance (threshold <= 5) across ALL prior images a student uploaded (any challenge).
- Local filesystem storage under `server/uploads/<student_id>/challenge_<challenge_id>/`.
- Frontend upload UI inside each challenge card (toggle with the Proof button).
- Local persistence of uploaded submissions (metadata + preview URL) via `localStorage` for offline demo.

### Backend Setup
1. Navigate to project root.
2. (Recommended) Create a Python virtual environment.
3. Install requirements:
```
pip install -r server/requirements.txt
```
4. Run the API:
```
uvicorn server.app:app --reload --port 8000
```
5. API will be available at `http://localhost:8000`.

### Endpoints
- `POST /upload-challenge-proof` (multipart form-data)
  - Fields: `student_id`, `challenge_id`, `file` (image)
  - Responses:
    - 200: `{ success: true, record: { ... } }`
    - 409: `{ error: "Duplicate image detected" }`
    - 400: `{ error: "Only image uploads are allowed" }` or invalid image message
- `GET /student/{student_id}/images` → `{ images: [...] }`
- `GET /health` → `{ status: "ok" }`

### Hash Storage File (`hashes.json`)
Structure:
```json
{
  "students": {
    "<student_id>": {
      "images": [
        {
          "challenge_id": "123",
          "filename": "20240928_120000_000000_original.png",
          "relative_path": "<student_id>/challenge_123/20240928_120000_000000_original.png",
          "uploaded_at": "20240928_120000_000000",
          "hash": { "aHash": "...", "dHash": "...", "combined": "..." }
        }
      ]
    }
  }
}
```

### Frontend Usage
- Each challenge card has a Proof button once a user (student) is present.
- Selecting an image triggers the upload.
- Duplicate -> red inline alert explaining it's a duplicate.
- Success -> green confirmation and image appears in the submission grid.

### Environment Variable (Optional)
Set `VITE_API_BASE` to point to backend if not running on `http://localhost:8000`.

### Presentation Notes
- Explain perceptual hashing: aHash (average comparison) + dHash (gradient comparison) combined for robustness.
- Hamming distance threshold 5 allows minor resizes/compression but flags identical / near-identical images.
- Entirely offline: no external APIs; images & hashes local.

### Future Enhancements (Ideas)
- Add pHash for even stronger resilience.
- Batch prefetch of existing images for gallery view.
- Teacher moderation dashboard for reviewing submissions.
- Size and dimension validation / compression before storage.

### Optional Enhancements Added
- Static file serving for uploaded proofs at `/uploads/...` (demo convenience).
- Added pHash (DCT-based perceptual hash) to strengthen duplicate detection (combined hash now = aHash + dHash + pHash). Backward compatible with earlier records (pHash empty string if missing).
- Frontend hydrates existing submissions from backend on mount.

### Security Note
For production you would:
- Restrict CORS origins
- Serve uploads via authenticated routes or signed URLs
- Store files outside repo root or in object storage
- Sanitize & validate file size / type limits
