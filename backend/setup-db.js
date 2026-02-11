import db from './db.js';

const setupDatabase = () => {
  console.log('\n🔧 Setting up database tables...');

  // 1. Create USERS table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      phone VARCHAR(10) NOT NULL,
      college VARCHAR(100) NOT NULL,
      usn VARCHAR(20) UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_usn (usn)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  // 2. Create ORDERS table
  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL UNIQUE,
      user_id INT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL,
      phone VARCHAR(10) NOT NULL,
      college VARCHAR(100),
      team_name VARCHAR(100),
      team_size INT DEFAULT 1,
      total_amount DECIMAL(10, 2) DEFAULT 0.00,
      status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED') DEFAULT 'PENDING',
      razorpay_order_id VARCHAR(100),
      razorpay_payment_id VARCHAR(100),
      razorpay_signature VARCHAR(255),
      payment_verified_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_order_id (order_id),
      INDEX idx_user_id (user_id),
      INDEX idx_email (email),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  // 3. Create ORDER_ITEMS table
  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(50) NOT NULL,
      event_id INT NOT NULL,
      event_name VARCHAR(150) NOT NULL,
      event_fee DECIMAL(10, 2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  // 4. Create EVENT_REGISTRATIONS table
  const createEventRegistrationsTable = `
    CREATE TABLE IF NOT EXISTS event_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      event_id INT NOT NULL,
      order_id VARCHAR(50),
      status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
      registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_registration (user_id, event_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE SET NULL,
      INDEX idx_user_id (user_id),
      INDEX idx_event_id (event_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  // 5. Create EMAIL_LOGS table
  const createEmailLogsTable = `
    CREATE TABLE IF NOT EXISTS email_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      email_to VARCHAR(120) NOT NULL,
      email_type ENUM('WELCOME', 'PAYMENT_CONFIRMATION', 'REGISTRATION', 'RESET_PASSWORD') DEFAULT 'WELCOME',
      subject VARCHAR(255),
      status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sent_at TIMESTAMP NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_email_to (email_to),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  const tables = [
    { name: 'users', sql: createUsersTable },
    { name: 'orders', sql: createOrdersTable },
    { name: 'order_items', sql: createOrderItemsTable },
    { name: 'event_registrations', sql: createEventRegistrationsTable },
    { name: 'email_logs', sql: createEmailLogsTable }
  ];

  tables.forEach(({ name, sql }) => {
    db.query(sql, (err) => {
      if (err) {
        console.error(`❌ Error creating ${name} table:`, err.message);
      } else {
        console.log(`✅ ${name} table ready`);
      }
    });
  });

  console.log('✨ Database setup complete!\n');
};

export default setupDatabase;
