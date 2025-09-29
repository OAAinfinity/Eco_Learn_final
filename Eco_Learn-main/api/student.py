from http.server import BaseHTTPRequestHandler
import json
import os
import sys
from urllib.parse import urlparse

# Add the api directory to sys.path
sys.path.append('/var/task/api')
sys.path.append(os.path.dirname(__file__))

try:
    from storage import get_student_images
except ImportError:
    def get_student_images(student_id):
        return []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Parse the URL to get student_id
            url_path = urlparse(self.path).path
            path_parts = url_path.strip('/').split('/')
            
            # Expected URL format: /api/student/{student_id}/images
            if len(path_parts) >= 3 and path_parts[0] == 'student' and path_parts[2] == 'images':
                student_id = path_parts[1]
            else:
                self.send_error_response(400, "Invalid URL format. Expected: /api/student/{student_id}/images")
                return

            # Get student's images
            images = get_student_images(student_id)

            # Send response
            self.send_success_response({
                "images": images,
                "student_id": student_id,
                "total_count": len(images)
            })

        except Exception as e:
            self.send_error_response(500, f"Server error: {str(e)}")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        error_data = {"error": message}
        self.wfile.write(json.dumps(error_data).encode())