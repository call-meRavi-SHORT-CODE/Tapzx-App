import sqlite3
import os
from config import Config

class Database:
    def __init__(self):
        self.db_path = Config.DATABASE_PATH
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database with tables"""
        conn = self.get_connection()
        
        # Create users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone_number TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_profile_complete BOOLEAN DEFAULT FALSE
            )
        ''')
        
        # Create links table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS links (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                website TEXT,
                email TEXT,
                phone TEXT,
                whatsapp TEXT,
                instagram TEXT,
                twitter TEXT,
                linkedin TEXT,
                facebook TEXT,
                youtube TEXT,
                tiktok TEXT,
                github TEXT,
                discord TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(user_id)
            )
        ''')
        
        # Create profiles table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                username TEXT UNIQUE NOT NULL,
                organization_name TEXT NOT NULL,
                bio TEXT NOT NULL,
                location TEXT NOT NULL,
                profile_image TEXT,
                profile_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(user_id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("SQLite database initialized successfully!")
    
    def execute_query(self, query, params=None):
        """Execute a query and return results"""
        conn = self.get_connection()
        try:
            if params:
                result = conn.execute(query, params)
            else:
                result = conn.execute(query)
            
            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')):
                conn.commit()
                return result.lastrowid if query.strip().upper().startswith('INSERT') else result.rowcount
            else:
                return result.fetchall()
        finally:
            conn.close()
    
    def execute_single(self, query, params=None):
        """Execute a query and return single result"""
        conn = self.get_connection()
        try:
            if params:
                result = conn.execute(query, params).fetchone()
            else:
                result = conn.execute(query).fetchone()
            return result
        finally:
            conn.close()

# Global database instance
database = Database()