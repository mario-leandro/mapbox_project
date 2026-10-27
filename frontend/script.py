# "Static dev server with SPA fallback: unknown paths without a file extension serve index.html."
import http.server
import os
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5500


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        clean_path = self.path.split("?", 1)[0].split("#", 1)[0]
        if not os.path.exists(self.translate_path(clean_path)) and "." not in os.path.basename(clean_path):
            self.path = "/index.html"
        super().do_GET()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), SPAHandler) as server:
    print(f"Serving on http://localhost:{PORT}")
    server.serve_forever()
