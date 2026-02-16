-- SQLite schema for Envision Event Management
-- Converted from MySQL to SQLite for Cloudflare D1

-- Drop tables if they exist (for fresh deployments)
DROP TABLE IF EXISTS core_team;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS teams;

-- Teams table
CREATE TABLE teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_id INTEGER NOT NULL,
  event_name TEXT NOT NULL,
  description TEXT,
  fee DECIMAL(10,2) DEFAULT 0.00,
  event_type TEXT DEFAULT 'Technical' CHECK (event_type IN ('Technical', 'Non-Technical')),
  is_mega_event INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Core Team table
CREATE TABLE core_team (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  team_id INTEGER NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_events_department ON events(department_id);
CREATE INDEX idx_core_team_team ON core_team(team_id);
CREATE INDEX idx_departments_name ON departments(department_name);

-- Insert Team Data
INSERT INTO teams (id, team_name, created_at) VALUES
(1, 'Technical', '2026-01-17 07:30:56'),
(2, 'Design', '2026-01-17 07:30:56'),
(3, 'Marketing', '2026-01-17 07:30:56'),
(4, 'Operations', '2026-01-17 07:30:56');

-- Insert Department Data
INSERT INTO departments (id, department_name, created_at) VALUES
(1, 'EEE', '2026-01-18 04:47:39'),
(2, 'Marine', '2026-01-18 04:47:39'),
(3, 'E&C', '2026-01-18 04:47:39'),
(4, 'CSBS', '2026-01-18 04:47:39'),
(5, 'CSE(SU)', '2026-01-18 04:47:39'),
(6, 'AIML', '2026-01-18 04:47:39'),
(7, 'Aeronautical', '2026-01-18 04:47:39'),
(8, 'Automobile', '2026-01-18 04:47:39'),
(9, 'Mechanical', '2026-01-18 04:47:39'),
(10, 'CSE(VTU)', '2026-01-18 04:47:39'),
(11, 'AIDS', '2026-01-18 04:47:39'),
(12, 'ISE & CSD', '2026-01-18 04:47:39');

-- Insert Event Data
INSERT INTO events (id, department_id, event_name, description, fee, event_type, is_mega_event, created_at) VALUES
(1, 1, 'Freefire', 'A thrilling coding competition testing your algorithmic skills and problem-solving abilities', 100.00, 'Non-Technical', 0, '2026-01-18 04:48:13'),
(2, 2, 'Memoria', 'Build innovative web applications using cutting-edge technologies', 150.00, 'Technical', 0, '2026-01-18 04:48:29'),
(3, 2, 'Knowledge Quest', 'Design and implement efficient algorithms to solve complex problems', 120.00, 'Technical', 0, '2026-01-18 04:48:29'),
(4, 2, 'Nautical Rides', 'Showcase your expertise in data structures and algorithm optimization', 130.00, 'Non-Technical', 0, '2026-01-18 04:48:29'),
(5, 3, 'Circuit Heist', 'Present your innovative ideas and business proposals to industry experts', 80.00, 'Technical', 0, '2026-01-18 04:49:12'),
(6, 3, 'Piece to Picture', 'Test your general knowledge across various domains and win exciting prizes', 50.00, 'Non-Technical', 0, '2026-01-18 04:49:12'),
(7, 4, 'IT Manager', 'Showcase your artistic talents through various creative mediums', 75.00, 'Technical', 0, '2026-01-18 04:50:10'),
(8, 4, 'Click it win it', 'Battle it out in competitive debate rounds on contemporary topics', 60.00, 'Non-Technical', 0, '2026-01-18 04:50:10'),
(9, 5, 'Debug Titans', 'The ultimate coding marathon - 48 hours of innovation, creativity, and problem-solving', 500.00, 'Technical', 1, '2026-01-18 04:51:15'),
(10, 5, 'Spectrum of Style', 'Grand tech fest featuring workshops, competitions, and networking opportunities', 300.00, 'Non-Technical', 1, '2026-01-18 04:51:15'),
(11, 6, 'RAHASYA', NULL, 0.00, 'Technical', 0, '2026-01-18 04:51:34'),
(12, 6, 'SUPER MINUTE', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:51:34'),
(13, 7, 'Water Rocketry', NULL, 0.00, 'Technical', 0, '2026-01-18 04:51:49'),
(14, 7, 'Flight Simulator', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:51:49'),
(15, 8, 'Slow Bike Race', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:03'),
(16, 8, 'Hogathon', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:03'),
(17, 9, 'Treasure Hunt', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:24'),
(18, 10, 'Operation CipherChase', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:40'),
(19, 10, 'Survive Arena (BGMI)', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:40'),
(20, 11, 'Blind Coding', NULL, 0.00, 'Technical', 0, '2026-01-18 04:52:53'),
(21, 11, 'Geo Guesser', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:52:53'),
(22, 12, 'Reverse Coding', NULL, 0.00, 'Technical', 0, '2026-01-18 04:54:04'),
(23, 12, 'Dumb Charades', NULL, 0.00, 'Non-Technical', 0, '2026-01-18 04:54:04');

-- Insert Core Team Data
INSERT INTO core_team (id, name, role, team_id, image_url, display_order, created_at) VALUES
(1, 'Arjun Rao', 'Technical Lead', 1, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(2, 'Meera Nair', 'Backend Developer', 1, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(3, 'Karthik Shetty', 'Frontend Developer', 1, 'https://via.placeholder.com/150', 3, '2026-01-17 07:52:18'),
(4, 'Ananya Sharma', 'Design Head', 2, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(5, 'Rohan Patel', 'UI/UX Designer', 2, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(6, 'Sneha Iyer', 'Marketing Lead', 3, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(7, 'Vikram Singh', 'Social Media Strategist', 3, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18'),
(8, 'Neha Kulkarni', 'Operations Head', 4, 'https://via.placeholder.com/150', 1, '2026-01-17 07:52:18'),
(9, 'Aditya Verma', 'Logistics Coordinator', 4, 'https://via.placeholder.com/150', 2, '2026-01-17 07:52:18');
