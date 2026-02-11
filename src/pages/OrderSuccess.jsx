import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccess.css';
import { clearCart } from '../services/api';

export default function OrderSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, amount, items = [], user = {} } = location.state || {};

    const [downloadingReceipt, setDownloadingReceipt] = useState(false);

    // Redirect if no order data
    useEffect(() => {
        if (!orderId) {
            navigate('/');
        }

        // Clear cart after successful payment
        clearCart();
    }, [orderId, navigate]);

    const handleDownloadReceipt = () => {
        setDownloadingReceipt(true);

        // Create receipt content
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #ff9d00; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { color: #ff9d00; margin: 0; }
                    .header p { color: #666; margin: 10px 0 0 0; }
                    .status { text-align: center; padding: 20px; background: #e8f5e9; border-radius: 8px; margin-bottom: 30px; }
                    .status h2 { color: #2e7d32; margin: 0; }
                    .section { margin-bottom: 30px; }
                    .section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
                    .info-row.total { font-weight: bold; font-size: 18px; padding: 15px 0; border-top: 2px solid #ff9d00; }
                    .label { color: #666; }
                    .value { color: #333; font-weight: 500; }
                    .items-list { list-style: none; padding: 0; }
                    .items-list li { padding: 10px; background: #f9f9f9; margin-bottom: 8px; border-radius: 4px; }
                    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Registration Confirmed</h1>
                        <p>Envision 2026</p>
                    </div>

                    <div class="status">
                        <h2>✓ Payment Successful</h2>
                    </div>

                    <div class="section">
                        <h3>Order Details</h3>
                        <div class="info-row">
                            <span class="label">Order ID</span>
                            <span class="value">${orderId}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Date</span>
                            <span class="value">${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Time</span>
                            <span class="value">${new Date().toLocaleTimeString('en-IN')}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Participant Details</h3>
                        <div class="info-row">
                            <span class="label">Name</span>
                            <span class="value">${user.name || '-'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email</span>
                            <span class="value">${user.email || '-'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Phone</span>
                            <span class="value">${user.phone || '-'}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">College</span>
                            <span class="value">${user.college || '-'}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Registered Events</h3>
                        <ul class="items-list">
                            ${items.map(item => `<li>✓ ${item.name} (₹${item.fee})</li>`).join('')}
                        </ul>
                    </div>

                    <div class="section">
                        <div class="info-row total">
                            <span>Total Amount Paid</span>
                            <span>₹${amount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>This is an automated receipt. A confirmation email has been sent to your email address.</p>
                        <p>For support, contact us at envision@example.com</p>
                        <p>&copy; 2026 Envision. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Create blob and download
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${orderId}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloadingReceipt(false);
    };

    if (!orderId) {
        return null;
    }

    return (
        <div className="order-success-container">
            {/* Success Animation */}
            <div className="success-animation">
                <div className="checkmark">✓</div>
            </div>

            {/* Main Content */}
            <div className="success-content">
                <h1>Payment Successful! 🎉</h1>
                <p className="subtitle">Your registration has been confirmed</p>

                {/* Order Details Card */}
                <div className="order-details-card">
                    <div className="detail-row">
                        <span className="detail-label">Order ID</span>
                        <span className="detail-value">{orderId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Amount Paid</span>
                        <span className="detail-value amount">₹{amount.toFixed(2)}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Date & Time</span>
                        <span className="detail-value">
                            {new Date().toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="user-info-card">
                    <h3>Participant Details</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Name</span>
                            <span className="info-value">{user.name}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{user.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">College</span>
                            <span className="info-value">{user.college}</span>
                        </div>
                    </div>
                </div>

                {/* Registered Events Card */}
                <div className="events-card">
                    <h3>Registered Events ({items.length})</h3>
                    <div className="events-list">
                        {items.map((item, index) => (
                            <div key={index} className="event-item">
                                <span className="event-check">✓</span>
                                <span className="event-name">{item.name}</span>
                                <span className="event-fee">₹{item.fee}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Info */}
                <div className="info-box">
                    <h3>📋 Important Information</h3>
                    <ul>
                        <li>A confirmation email has been sent to <strong>{user.email}</strong></li>
                        <li>Your registration details are saved in your profile</li>
                        <li>You will receive event updates via email</li>
                        <li>Keep your Order ID safe for reference</li>
                        <li>Download this receipt for your records</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        onClick={handleDownloadReceipt}
                        className="btn-download-receipt"
                        disabled={downloadingReceipt}
                    >
                        {downloadingReceipt ? 'Downloading...' : '📥 Download Receipt'}
                    </button>

                    <button
                        onClick={() => navigate('/profile')}
                        className="btn-view-profile"
                    >
                        👤 View Profile
                    </button>

                    <button
                        onClick={() => navigate('/events')}
                        className="btn-explore-more"
                    >
                        🎯 Explore More Events
                    </button>
                </div>

                {/* Confirmation Message */}
                <div className="confirmation-message">
                    <p>✓ You're all set! See you at Envision 2026! 🚀</p>
                </div>
            </div>
        </div>
    );
}
