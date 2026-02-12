-- Migration: Create users table
-- Description: Authentication system with users table for D1 database

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'researcher' CHECK(role IN ('clinician', 'researcher', 'admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
