#!/usr/bin/env python3
"""
NEXUS PORT - Simple HTTP Server
Serves the JavaScript-based games portal with proper MIME types
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000
MIME_TYPES = {
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.html': 'text/html',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
}

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add proper MIME type headers
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        elif self.path.endswith('.css'):
            self.send_header('Content-Type', 'text/css')
        
        # Allow CORS (optional, but useful for development)
        self.send_header('Access-Control-Allow-Origin', '*')
        
        super().end_headers()
    
    def do_GET(self):
        # Route / to index.html
        if self.path == '/':
            self.path = '/index.html'
        
        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print("🎮 NEXUS PORT SERVER STARTED")
        print("=" * 60)
        print(f"Server running at: http://localhost:{PORT}")
        print(f"Open your browser and visit: http://localhost:{PORT}")
        print("\nPress Ctrl+C to stop the server")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")

