-- SQL Schema Migration for Platione Sales Assist QA Database Setup

CREATE TABLE IF NOT EXISTS contacts (
  id VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  company VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS planned_actions (
  id VARCHAR(50) PRIMARY KEY,
  contact_id VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Planned',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS completed_interactions (
  id VARCHAR(50) PRIMARY KEY,
  contact_id VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  date DATETIME NOT NULL,
  notes TEXT,
  outcome VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
