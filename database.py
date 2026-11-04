import os
import sqlite3
import pymysql
from datetime import datetime

USE_SQLITE_FALLBACK = False
DB_PATH = os.path.join(os.path.dirname(__file__), "thorex_ai.db")

class SqliteWrapperConn:
    def __init__(self, conn):
        self.conn = conn
    def cursor(self):
        return SqliteWrapperCursor(self.conn.cursor())
    def commit(self):
        self.conn.commit()
    def close(self):
        self.conn.close()

class SqliteWrapperCursor:
    def __init__(self, cursor):
        self.cursor = cursor
    def execute(self, query, params=None):
        q = query.replace("%s", "?").replace("REPLACE INTO", "INSERT OR REPLACE INTO")
        q = q.replace("`key`", "key").replace("`value`", "value")
        q = q.replace("VARCHAR(255)", "TEXT")
        if params is None:
            return self.cursor.execute(q)
        return self.cursor.execute(q, params)
    def fetchone(self):
        row = self.cursor.fetchone()
        return dict(row) if row else None
    def fetchall(self):
        rows = self.cursor.fetchall()
        return [dict(r) for r in rows] if rows else []

def get_db_connection():
    global USE_SQLITE_FALLBACK
    if USE_SQLITE_FALLBACK:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return SqliteWrapperConn(conn)
    try:
        ssl_param = None
        if os.getenv("MYSQL_SSL", "false").lower() == "true":
            ssl_param = {}
            
        return pymysql.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            database=os.getenv("MYSQL_DATABASE", "thorex_ai"),
            port=int(os.getenv("MYSQL_PORT", 3306)),
            ssl=ssl_param,
            cursorclass=pymysql.cursors.DictCursor
        )
    except Exception as e:
        print(f"Notice: MySQL connection not available ({e}). Falling back to local SQLite database.")
        USE_SQLITE_FALLBACK = True
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return SqliteWrapperConn(conn)

def init_db():
    global USE_SQLITE_FALLBACK
    ssl_param = None
    if os.getenv("MYSQL_SSL", "false").lower() == "true":
        ssl_param = {}
        
    try:
        # 1. Connect to MySQL server without database selected
        conn = pymysql.connect(
            host=os.getenv("MYSQL_HOST", "localhost"),
            user=os.getenv("MYSQL_USER", "root"),
            password=os.getenv("MYSQL_PASSWORD", ""),
            port=int(os.getenv("MYSQL_PORT", 3306)),
            ssl=ssl_param
        )
        cursor = conn.cursor()
        db_name = os.getenv("MYSQL_DATABASE", "thorex_ai")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Notice: MySQL connection attempt failed. Using local SQLite database.")
        USE_SQLITE_FALLBACK = True

    # 2. Connect and create tables
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Create sessions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        user_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    """)
    
    # Create messages table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        session_id VARCHAR(255),
        role VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES sessions (id) ON DELETE CASCADE
    )
    """)
    
    # Create settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        `key` VARCHAR(255) PRIMARY KEY,
        `value` TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def create_user(user_id: str, username: str, email: str, password_hash: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (id, username, email, password_hash, created_at) VALUES (%s, %s, %s, %s, %s)",
        (user_id, username, email, password_hash, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    conn.close()

def get_user_by_username(username: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, password_hash, created_at FROM users WHERE username = %s", (username,))
    row = cursor.fetchone()
    conn.close()
    return row

def get_user_by_id(user_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, created_at FROM users WHERE id = %s", (user_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def get_sessions(user_id: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT id, title, created_at FROM sessions WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
    else:
        cursor.execute("SELECT id, title, created_at FROM sessions WHERE user_id IS NULL OR user_id = '' ORDER BY created_at DESC")
    sessions = cursor.fetchall()
    conn.close()
    return sessions

def create_session(session_id: str, title: str = "New Conversation", user_id: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sessions (id, title, user_id, created_at) VALUES (%s, %s, %s, %s)",
        (session_id, title, user_id, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    conn.close()

def update_session_title(session_id: str, title: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE sessions SET title = %s WHERE id = %s", (title, session_id))
    conn.commit()
    conn.close()

def delete_session(session_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM sessions WHERE id = %s", (session_id,))
    cursor.execute("DELETE FROM messages WHERE session_id = %s", (session_id,))
    conn.commit()
    conn.close()

def save_message(message_id: str, session_id: str, role: str, content: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (%s, %s, %s, %s, %s)",
        (message_id, session_id, role, content, datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    )
    conn.commit()
    conn.close()

def get_messages(session_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, session_id, role, content, created_at FROM messages WHERE session_id = %s ORDER BY created_at ASC",
        (session_id,)
    )
    messages = cursor.fetchall()
    conn.close()
    return messages

def save_setting(key: str, value: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "REPLACE INTO settings (`key`, `value`) VALUES (%s, %s)",
        (key, value)
    )
    conn.commit()
    conn.close()

def get_setting(key: str) -> str:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT `value` FROM settings WHERE `key` = %s", (key,))
    row = cursor.fetchone()
    conn.close()
    return row["value"] if row else None
