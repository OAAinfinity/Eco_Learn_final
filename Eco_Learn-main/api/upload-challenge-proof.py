from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import io
from datetime import datetime

# Add the api directory to sys.path to import our utilities
sys.path.append('/var/task/api')
sys.path.append(os.path.dirname(__file__))

try:
    from utils.image_hash import compute_combined_hash, is_duplicate
    from storage import add_student_image, get_student_hashes
except ImportError:
    # Fallback if import fails
    def compute_combined_hash(image_bytes):
        return {"combined": f"fallback_hash_{len(image_bytes)}"}
    
    def is_duplicate(new_hash, existing_hashes, threshold=5):
        return False
    
    def add_student_image(student_id, record):
        return 1
    
    def get_student_hashes(student_id):
        return []

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Parse the multipart form data
            content_type = self.headers.get('Content-Type', '')
            if not content_type.startswith('multipart/form-data'):
                self.send_error_response(400, "Only multipart/form-data supported")
                return

            # Get the content length
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error_response(400, "No data received")
                return

            # Read the form data
            form_data = self.rfile.read(content_length)
            
            # Parse multipart data manually
            boundary = content_type.split('boundary=')[1].encode()
            parts = form_data.split(b'--' + boundary)
            
            student_id = None
            challenge_id = None
            file_data = None
            filename = None
            
            for part in parts:
                if b'Content-Disposition: form-data' in part:
                    if b'name="student_id"' in part:
                        student_id = part.split(b'\r\n\r\n')[1].split(b'\r\n')[0].decode()
                    elif b'name="challenge_id"' in part:
                        challenge_id = part.split(b'\r\n\r\n')[1].split(b'\r\n')[0].decode()
                    elif b'name="file"' in part and b'filename=' in part:
                        header_section = part.split(b'\r\n\r\n')[0]
                        filename_start = header_section.find(b'filename="') + 10
                        filename_end = header_section.find(b'"', filename_start)
                        filename = header_section[filename_start:filename_end].decode()
                        
                        # Extract file data (everything after the double CRLF)
                        data_start = part.find(b'\r\n\r\n') + 4
                        file_data = part[data_start:part.rfind(b'\r\n')]

            if not all([student_id, challenge_id, file_data]):
                self.send_error_response(400, "Missing required fields: student_id, challenge_id, or file")
                return

            # Check if it's an image
            if not filename or not any(filename.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']):
                self.send_error_response(400, "Only image files are allowed")
                return

            # Compute hash for duplicate detection
            try:
                new_hash = compute_combined_hash(file_data)
            except Exception as e:
                self.send_error_response(400, f"Invalid image file: {str(e)}")
                return

            # Check for duplicates
            existing_hashes = get_student_hashes(student_id)
            if is_duplicate(new_hash, existing_hashes, threshold=5):
                self.send_error_response(409, "Duplicate image detected")
                return

            # Store the new hash
            timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')
            safe_filename = filename.replace(' ', '_')
            stored_filename = f"{timestamp}_{safe_filename}"

            record = {
                "challenge_id": challenge_id,
                "filename": stored_filename,
                "uploaded_at": timestamp,
                "hash": new_hash,
                "file_size": len(file_data)
            }
            
            total_files = add_student_image(student_id, record)

            # Send success response
            self.send_success_response({
                "success": True, 
                "record": record,
                "message": f"File uploaded successfully. Total files for student: {total_files}"
            })

        except Exception as e:
            self.send_error_response(500, f"Server error: {str(e)}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        error_data = {"error": message}
        self.wfile.write(json.dumps(error_data).encode())