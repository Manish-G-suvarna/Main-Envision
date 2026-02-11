import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';
import { getCart, removeFromCart, clearCart, isAuthenticated, getCurrentUser } from '../services/api';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: location } });
            return;
        }

        // Get current user and cart
        try {
            const currentUser = getCurrentUser();
            setUser(currentUser);

            const items = getCart();
            setCartItems(items);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleRemoveItem = (eventId) => {
        removeFromCart(eventId);
        const updated = cartItems.filter(item => item.id !== eventId);
        setCartItems(updated);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear the entire cart?')) {
            clearCart();
            setCartItems([]);
        }
    };

    const getTotalAmount = () => {
        return cartItems.reduce((sum, item) => sum + parseFloat(item.fee), 0);
    };

    if (loading) {
        return <div className="cart-loading">Loading cart...</div>;
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <div className="empty-state">
                    <h2>Your Cart is Empty</h2>
                    <p>Add some events to get started!</p>
                    <button onClick={() => navigate('/events')} className="btn-continue-shopping">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const totalAmount = getTotalAmount();

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>🛒 Your Cart</h1>
                <p className="cart-subtitle">{cartItems.length} event{cartItems.length !== 1 ? 's' : ''} selected</p>
            </div>

            <div className="cart-content">
                {/* Cart Items */}
                <div className="cart-items-section">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-info">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-type">
                                        <span className="type-badge">{item.type}</span>
                                    </p>
                                    <p className="item-department">📍 {item.department}</p>
                                </div>

                                <div className="item-price">
                                    <span className="price-label">Fee</span>
                                    <span className="price-value">₹{item.fee}</span>
                                </div>

                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="btn-remove"
                                    title="Remove from cart"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-actions">
                        <button onClick={() => navigate('/events')} className="btn-continue-shopping">
                            ← Continue Shopping
                        </button>
                        <button onClick={handleClearCart} className="btn-clear-cart">
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2>Order Summary</h2>

                    <div className="summary-items">
                        <div className="summary-row">
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Platform Fee</span>
                            <span>₹0</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span className="total-amount">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="user-info-summary">
                        <h3>Registered As</h3>
                        <p className="info-item">
                            <span className="label">Name:</span>
                            <span className="value">{user?.name}</span>
                        </p>
                        <p className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user?.email}</span>
                        </p>
                        <p className="info-item">
                            <span className="label">Phone:</span>
                            <span className="value">{user?.phone}</span>
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/checkout', { state: { cartItems, totalAmount } })}
                        className="btn-proceed-checkout"
                    >
                        <span>Proceed to Checkout</span>
                        <span className="arrow">→</span>
                    </button>

                    <p className="secure-checkout">
                        🔒 Secure checkout powered by Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
}
