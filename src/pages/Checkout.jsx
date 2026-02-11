import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import {
    getCurrentUser,
    createOrder,
    createPaymentOrder,
    verifyPayment,
    isAuthenticated,
    getCart,
    clearCart
} from '../services/api';

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
    });

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    // Initialize checkout
    useEffect(() => {
        const initCheckout = async () => {
            try {
                // Check authentication
                if (!isAuthenticated()) {
                    navigate('/login', { state: { from: '/checkout' } });
                    return;
                }

                // Get current user data
                const user = getCurrentUser();
                if (!user) {
                    navigate('/login');
                    return;
                }

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    college: user.college || '',
                });

                // Get cart items
                const items = getCart();
                if (!items || items.length === 0) {
                    navigate('/events');
                    return;
                }

                setCartItems(items);

                // Calculate total
                const total = items.reduce((sum, item) => sum + (parseFloat(item.fee) || 0), 0);
                setTotalAmount(total);

                setLoading(false);
            } catch (err) {
                console.error('Error initializing checkout:', err);
                setError('Error loading checkout. Please try again.');
                setLoading(false);
            }
        };

        initCheckout();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError('Valid email address is required');
            return false;
        }
        if (!formData.phone.trim() || formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
            setError('Valid 10-digit phone number is required');
            return false;
        }
        if (!formData.college.trim()) {
            setError('College is required');
            return false;
        }
        return true;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setProcessing(true);

            // Step 1: Create order on backend
            const orderResponse = await createOrder({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                cartItems: cartItems.map(item => ({ id: item.id })),
            });

            if (!orderResponse.order || !orderResponse.order.orderId) {
                throw new Error('Failed to create order');
            }

            const { orderId, totalAmount: amount } = orderResponse.order;

            // Step 2: Create Razorpay payment order
            const paymentOrderResponse = await createPaymentOrder(orderId);

            if (!paymentOrderResponse.orderId) {
                throw new Error('Failed to create payment order');
            }

            // Step 3: Load Razorpay script
            const isRazorpayLoaded = await loadRazorpayScript();
            if (!isRazorpayLoaded) {
                throw new Error('Failed to load Razorpay. Please try again.');
            }

            // Step 4: Initialize Razorpay payment
            const options = {
                key: 'rzp_test_SDgGaJIf8V2Jxd', // Test key ID
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                name: 'Envision 2026',
                description: `Registration for ${cartItems.length} event(s)`,
                order_id: paymentOrderResponse.orderId,

                handler: async (response) => {
                    try {
                        // Step 5: Verify payment on backend
                        const verifyResponse = await verifyPayment({
                            orderId: orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (!verifyResponse.success) {
                            throw new Error(verifyResponse.message || 'Payment verification failed');
                        }

                        // Clear cart on success
                        clearCart();

                        // Redirect to success page
                        navigate('/order-success', {
                            state: {
                                orderId: orderId,
                                amount: amount,
                                items: cartItems,
                                user: formData,
                            }
                        });
                    } catch (err) {
                        setError(`Payment verification failed: ${err.message}`);
                        setProcessing(false);
                    }
                },

                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },

                theme: {
                    color: '#ff9d00',
                },

                modal: {
                    ondismiss: () => {
                        setError('Payment cancelled. Please try again.');
                        setProcessing(false);
                    },
                },
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Failed to process checkout');
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="checkout-loading">Loading checkout...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout-container">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                </div>
                <div className="empty-checkout">
                    <h2>Your cart is empty</h2>
                    <p>Add some events before checking out</p>
                    <button onClick={() => navigate('/events')} className="btn-back-to-cart">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <p>Complete your registration securely</p>
            </div>

            <div className="checkout-content">
                {/* Checkout Form */}
                <div className="checkout-form-section">
                    <form onSubmit={handleCheckout} className="checkout-form">
                        <h2>Billing Details</h2>

                        {error && (
                            <div className="error-alert">
                                <span>✕</span>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                disabled={processing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your@email.com"
                                disabled={processing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="10-digit phone number"
                                maxLength="10"
                                disabled={processing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>College</label>
                            <input
                                type="text"
                                name="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                placeholder="Your college name"
                                disabled={processing}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-pay-now"
                            disabled={processing}
                        >
                            {processing ? 'Processing...' : `Pay ₹${totalAmount.toFixed(2)} Now`}
                        </button>

                        <p className="secure-payment">
                            🔒 Powered by Razorpay | 100% Secure
                        </p>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="order-summary-section">
                    <h2>Order Summary</h2>

                    <div className="summary-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-fee">₹{parseFloat(item.fee).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                        <span>Total Amount</span>
                        <span className="total-value">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="payment-info">
                        <h3>Trust & Safety</h3>
                        <ul>
                            <li>Secure payment gateway (Razorpay)</li>
                            <li>Instant confirmation & receipt</li>
                            <li>SSL/TLS encrypted connection</li>
                            <li>100% secure & verified</li>
                        </ul>
                    </div>

                    <div className="trust-badges">
                        <div className="badge">
                            <span className="badge-icon">🔐</span>
                            <span className="badge-text">SSL Secure</span>
                        </div>
                        <div className="badge">
                            <span className="badge-icon">✓</span>
                            <span className="badge-text">Verified</span>
                        </div>
                        <div className="badge">
                            <span className="badge-icon">🛡️</span>
                            <span className="badge-text">Protected</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/cart')}
                        className="btn-back-to-cart"
                    >
                        ← Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
