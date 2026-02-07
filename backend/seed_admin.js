import db from './db.js';

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Hash for 'admin'
const passwordHash = '$2b$10$6MMSZsJgXW6XVnepioyIY.iLu56qRE6ARJGgOad4O3tu0Fou1/Kmu';
const email = 'myadmin@envision.in';

const insertUserQuery = `
  INSERT INTO admins (email, password_hash) 
  VALUES (?, ?) 
  ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
        process.exit(1);
    }
    console.log('Admins table created or already exists.');

    db.query(insertUserQuery, [email, passwordHash], (err) => {
        if (err) {
            console.error('Error seeding user:', err);
            process.exit(1);
        }
        console.log('Admin user seeded successfully.');
        process.exit(0);
    });
});
