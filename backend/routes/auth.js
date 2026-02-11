import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, college, password } = req.body;

    // Validation
    if (!name || !email || !phone || !college || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    // Password length check
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into database
      const insertQuery = `
        INSERT INTO users (name, email, phone, college, password, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      db.query(
        insertQuery,
        [name, email, phone, college, hashedPassword],
        async (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ message: 'Error creating user' });
          }

          const userId = result.insertId;

          // Generate JWT token
          const token = jwt.sign(
            {
              id: userId,
              email: email,
              name: name
            },
            JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
          );

          // Return user data (without password)
          const user = {
            id: userId,
            name,
            email,
            phone,
            college
          };

          // Send welcome email (async, don't wait for it)
          sendWelcomeEmail(email, name, '', userId).catch(err => {
            console.error('Failed to send welcome email:', err);
          });

          res.status(201).json({
            message: 'Registration successful',
            token,
            user
          });
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user (supports both email and USN)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'USN/Email and password are required' });
    }

    // Find user by email OR usn
    const query = 'SELECT * FROM users WHERE email = ? OR usn = ?';
    db.query(query, [email, email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid USN/Email or password' });
      }

      const user = results[0];

      // Compare passwords
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid USN/Email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Return user data (without password)
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college
      };

      res.json({
        message: 'Login successful',
        token,
        user: userData
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token (for auto-login)
router.post('/verify', authenticateToken, (req, res) => {
  // If middleware passes, token is valid
  const query = 'SELECT id, name, email, phone, college FROM users WHERE id = ?';

  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      user: results[0]
    });
  });
});

// Update user profile
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, college } = req.body;
    const userId = req.user.id;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone) {
      // Validate phone
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone must be 10 digits' });
      }
      updates.push('phone = ?');
      values.push(phone);
    }
    if (college) {
      updates.push('college = ?');
      values.push(college);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(400).json({ message: 'Update failed' });
      }

      // Get updated user data
      const selectQuery = 'SELECT id, name, email, phone, college FROM users WHERE id = ?';
      db.query(selectQuery, [userId], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching updated data' });
        }

        res.json({
          message: 'Profile updated successfully',
          user: results[0]
        });
      });
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Get current password from database
    const query = 'SELECT password FROM users WHERE id = ?';
    db.query(query, [userId], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, results[0].password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(updateQuery, [hashedPassword, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating password' });
        }

        res.json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const query = 'SELECT id, name, email, phone, college, created_at FROM users WHERE id = ?';

  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: results[0] });
  });
});

export default router;
