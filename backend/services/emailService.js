import nodemailer from 'nodemailer';
import db from '../db.js';

// Create transporter (Gmail or custom SMTP)
// For Gmail: Use App Password (2FA enabled) or enable "Less secure app access"
// For testing: Use Mailtrap.io or similar service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'your-app-password'
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email service not configured:', error.message);
    console.warn('   Emails will not be sent unless SMTP_USER and SMTP_PASSWORD are set in .env');
  } else {
    console.log('✅ Email service configured successfully');
  }
});

/**
 * Send welcome email after registration
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} usn - User USN (if provided)
 * @param {number} userId - User ID
 */
export const sendWelcomeEmail = async (email, name, usn, userId) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@envision.com',
      to: email,
      subject: '🎉 Welcome to Envision 2026!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Welcome to Envision 2026! 🎉</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>

            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Thank you for registering for Envision 2026! You've joined a community of innovators and tech enthusiasts.
            </p>

            <div style="background-color: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #667eea;">Your Login Details</h3>
              <p style="margin: 10px 0; color: #333;">
                <strong>Email:</strong> ${email}
              </p>
              ${usn ? `<p style="margin: 10px 0; color: #333;">
                <strong>USN:</strong> ${usn}
              </p>` : ''}
              <p style="margin: 10px 0; color: #666; font-size: 13px;">
                You can use either your email or USN to login.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/login" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                Login Now
              </a>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Browse and explore all available events</li>
                <li>Add events to your cart</li>
                <li>Complete payment to confirm your registrations</li>
                <li>Receive confirmation email with event details</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, feel free to reach out to us.
            </p>

            <p style="color: #666; font-size: 14px;">
              Happy learning! 🚀<br>
              <strong>Team Envision</strong>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">© 2026 Envision. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email send in database
    const logQuery = `
      INSERT INTO email_logs (user_id, email_to, email_type, subject, status, sent_at)
      VALUES (?, ?, 'WELCOME', ?, 'SENT', NOW())
    `;
    db.query(logQuery, [userId, email, mailOptions.subject], (err) => {
      if (err) {
        console.error('Error logging email:', err);
      }
    });

    console.log('✅ Welcome email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);

    // Log failed email
    const logQuery = `
      INSERT INTO email_logs (user_id, email_to, email_type, subject, status, error_message)
      VALUES (?, ?, 'WELCOME', ?, 'FAILED', ?)
    `;
    db.query(logQuery, [userId, email, 'Welcome to Envision', error.message], (err) => {
      if (err) console.error('Error logging failed email:', err);
    });

    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} orderId - Order ID
 * @param {number} amount - Total amount paid
 * @param {array} events - Array of event names
 * @param {number} userId - User ID
 */
export const sendPaymentConfirmationEmail = async (email, name, orderId, amount, events, userId) => {
  try {
    const eventsList = events.map(event => `<li style="margin: 5px 0;">${event}</li>`).join('');

    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@envision.com',
      to: email,
      subject: '✅ Payment Confirmation - Envision 2026',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">✅ Payment Confirmed</h1>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>

            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              Your payment has been successfully received and processed. You are now registered for your selected events!
            </p>

            <div style="background-color: white; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #28a745;">Order Details</h3>
              <p style="margin: 10px 0; color: #333;">
                <strong>Order ID:</strong> ${orderId}
              </p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Amount Paid:</strong> ₹${amount}
              </p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Status:</strong> <span style="background-color: #28a745; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">PAID</span>
              </p>
            </div>

            <div style="background-color: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">You are registered for:</h3>
              <ul style="color: #666; line-height: 1.8;">
                ${eventsList}
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/profile" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
                View My Registrations
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              <strong>Important:</strong> Please keep your Order ID for reference. You will need it at the event registration desk.
            </p>

            <p style="color: #666; font-size: 14px;">
              See you at Envision 2026! 🎉<br>
              <strong>Team Envision</strong>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">© 2026 Envision. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email send in database
    const logQuery = `
      INSERT INTO email_logs (user_id, email_to, email_type, subject, status, sent_at)
      VALUES (?, ?, 'PAYMENT_CONFIRMATION', ?, 'SENT', NOW())
    `;
    db.query(logQuery, [userId, email, mailOptions.subject], (err) => {
      if (err) console.error('Error logging email:', err);
    });

    console.log('✅ Payment confirmation email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);

    // Log failed email
    const logQuery = `
      INSERT INTO email_logs (user_id, email_to, email_type, subject, status, error_message)
      VALUES (?, ?, 'PAYMENT_CONFIRMATION', ?, 'FAILED', ?)
    `;
    db.query(logQuery, [userId, email, 'Payment Confirmation', error.message], (err) => {
      if (err) console.error('Error logging failed email:', err);
    });

    return { success: false, error: error.message };
  }
};

export default {
  sendWelcomeEmail,
  sendPaymentConfirmationEmail
};
