#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小小國語學習家 v3.0 - Python 輕量本地端伺服器 (SQLite + Moedict API + 除錯日誌)
"""

import http.server
import json
import os
from pathlib import Path
import sqlite3
import urllib.parse
import urllib.request

PORT = 8801
DB_PATH = Path(__file__).parent / "mandarin_knowledge.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS knowledge_entries (
            id TEXT PRIMARY KEY,
            normalized_query TEXT UNIQUE,
            title TEXT,
            pronunciation TEXT,
            definition TEXT,
            word_combinations TEXT,
            example_sentences TEXT,
            source_id TEXT,
            source_url TEXT,
            source_license TEXT,
            verification_status TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def normalize_query(q: str) -> str:
    if not q:
        return ""
    return "".join(c for c in q.strip().lower() if c.isalnum() or '\u4e00' <= c <= '\u9fff')

class ReusableHTTPServer(http.server.HTTPServer):
    allow_reuse_address = True

class MandarinHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = dict(urllib.parse.parse_qsl(parsed_url.query, encoding='utf-8'))

        if path == "/api/health":
            self.send_json({"status": "ok", "backend": "python-sqlite"})
            return

        if path == "/api/search":
            raw_q = query_params.get("q", "")
            q = urllib.parse.unquote(raw_q).strip()
            if not q:
                self.send_json({"error": "Missing query parameter q"}, 400)
                return

            norm = normalize_query(q)
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM knowledge_entries WHERE normalized_query = ? OR title = ?", (norm, q))
            row = cursor.fetchone()
            
            if row:
                entry = dict(row)
                if entry.get("word_combinations"):
                    entry["word_combinations"] = json.loads(entry["word_combinations"])
                if entry.get("example_sentences"):
                    entry["example_sentences"] = json.loads(entry["example_sentences"])
                conn.close()
                self.send_json({"found": True, "source": "local_sqlite", "entry": entry})
                return

            encoded_q = urllib.parse.quote(q, encoding='utf-8')
            endpoints = [f"https://www.moedict.tw/uni/{encoded_q}.json", f"https://www.moedict.tw/a/{encoded_q}.json"]
            
            for endpoint in endpoints:
                try:
                    req = urllib.request.Request(endpoint, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=5) as response:
                        data = json.loads(response.read().decode("utf-8"))
                        if data and (data.get("title") or data.get("heteronyms")):
                            title = data.get("title", q)
                            heteronym = data.get("heteronyms", [{}])[0]
                            defs = "\n".join([f"{i+1}. {d.get('def', '')}" for i, d in enumerate(heteronym.get("definitions", []))]) or data.get("explanation", "無定義")
                            bopo = heteronym.get("bopomofo", "注音待確認")
                            
                            examples = []
                            for d in heteronym.get("definitions", []):
                                if "example" in d and isinstance(d["example"], list):
                                    for ex in d["example"]:
                                        examples.append({"sentence": ex, "sourceType": "dictionary"})
                            if not examples:
                                examples = [{"sentence": f"這是關於「{title}」的公開字典例句。", "sourceType": "system_practice"}]

                            entry = {
                                "id": f"py_{norm}",
                                "normalized_query": norm,
                                "title": title,
                                "pronunciation": bopo,
                                "definition": defs,
                                "word_combinations": json.dumps([], ensure_ascii=False),
                                "example_sentences": json.dumps(examples, ensure_ascii=False),
                                "source_id": "moedict_api",
                                "source_url": f"https://www.moedict.tw/{urllib.parse.quote(title)}",
                                "source_license": "CC-BY-NC-SA 3.0 / 萌典公開 API",
                                "verification_status": "VERIFIED",
                                "created_at": "2026-11-12"
                            }

                            cursor.execute("""
                                INSERT OR REPLACE INTO knowledge_entries 
                                (id, normalized_query, title, pronunciation, definition, word_combinations, example_sentences, source_id, source_url, source_license, verification_status, created_at)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            """, (
                                entry["id"], entry["normalized_query"], entry["title"], entry["pronunciation"],
                                entry["definition"], entry["word_combinations"], entry["example_sentences"],
                                entry["source_id"], entry["source_url"], entry["source_license"],
                                entry["verification_status"], entry["created_at"]
                            ))
                            conn.commit()

                            entry["word_combinations"] = []
                            entry["example_sentences"] = examples
                            conn.close()
                            self.send_json({"found": True, "source": "moedict_api", "entry": entry})
                            return
                except Exception as e:
                    print(f"Failed endpoint {endpoint}: {e}")
                    continue

            conn.close()
            self.send_json({"found": False, "message": "查無直接收錄"})
            return

        super().do_GET()

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

if __name__ == "__main__":
    init_db()
    print(f"=== 小小國語學習家 Python 本地端伺服器啟動 ===")
    print(f"伺服器運行於: http://localhost:{PORT}")
    server = ReusableHTTPServer(("0.0.0.0", PORT), MandarinHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n伺服器已關閉。")
