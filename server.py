import http.server
import socketserver
import time

PORT = 3000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        try:
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()
        except Exception:
            pass

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except Exception:
            pass

    def log_error(self, format, *args):
        # Suppress broken pipe and connection reset log spam
        pass

class RobustTCPServer(socketserver.TCPServer):
    allow_reuse_address = True
    def handle_error(self, request, client_address):
        # Silently absorb client disconnects and broken socket pipes
        pass

if __name__ == '__main__':
    while True:
        try:
            with RobustTCPServer(('0.0.0.0', PORT), NoCacheHTTPRequestHandler) as httpd:
                print(f"Robust HTTP server running on 0.0.0.0:{PORT}...")
                httpd.serve_forever()
        except Exception as e:
            time.sleep(0.5)
