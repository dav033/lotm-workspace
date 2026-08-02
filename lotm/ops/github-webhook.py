#!/usr/bin/env python3
import hashlib
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = os.environ.get("LOTM_WEBHOOK_HOST", "172.18.0.1")
PORT = int(os.environ.get("LOTM_WEBHOOK_PORT", "9010"))
SECRET_FILE = Path(os.environ.get("LOTM_WEBHOOK_SECRET_FILE", "/etc/lotm-deploy-webhook.secret"))
TRIGGER_FILE = Path(os.environ.get("LOTM_DEPLOY_TRIGGER_FILE", "/tmp/lotm-deploy.trigger"))
EXPECTED_REPOSITORY = "dav033/lotm-workspace"
MAX_BODY = 1_048_576


class Handler(BaseHTTPRequestHandler):
    server_version = "lotm-webhook/1"

    def do_POST(self):
        if self.path != "/deploy/github":
            return self.reply(404, b"not found")

        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return self.reply(400, b"invalid length")
        if length <= 0 or length > MAX_BODY:
            return self.reply(413, b"invalid body")

        body = self.rfile.read(length)
        secret = SECRET_FILE.read_bytes().strip()
        expected = "sha256=" + hmac.new(secret, body, hashlib.sha256).hexdigest()
        supplied = self.headers.get("X-Hub-Signature-256", "")
        if not hmac.compare_digest(expected, supplied):
            return self.reply(401, b"invalid signature")

        event = self.headers.get("X-GitHub-Event", "")
        if event == "ping":
            return self.reply(200, b"pong")
        if event != "push":
            return self.reply(202, b"ignored")

        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            return self.reply(400, b"invalid json")

        repository = payload.get("repository", {}).get("full_name")
        if repository != EXPECTED_REPOSITORY or payload.get("ref") != "refs/heads/main":
            return self.reply(202, b"ignored")

        TRIGGER_FILE.touch(exist_ok=True)
        with TRIGGER_FILE.open("a", encoding="utf-8") as trigger:
            trigger.write(payload.get("after", "unknown") + "\n")
        return self.reply(202, b"deploy queued")

    def log_message(self, message, *args):
        print(f"{self.address_string()} {message % args}", flush=True)

    def reply(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
