import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import mainBg from '../assets/images/main-bg.png';
import './Events.css'; // Reuse events styling for consistency

export default function Cart() {
    const { cart, removeFromCart } = useCart();
    const navigate = useNavigate();

    // Calculate total fee
    const totalFee = cart.reduce((total, event) => total + Number(event.fee || 0), 0);

    return (
        <div className="events-root" style={{ backgroundImage: `url(${mainBg})` }}>
            <div className="events-overlay"></div>

            <nav className="events-nav">
                <Link to="/" className="nav-btn back-btn">
                    <svg viewBox="0 0 24 24" className="icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    Back to Home
                </Link>
                <div className="nav-right">
                    <Link to="/events" className="nav-btn">
                        Add More Events
                        <svg viewBox="0 0 24 24" className="icon"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                    </Link>
                </div>
            </nav>

            <div className="events-glass-container" style={{ maxWidth: '1000px', margin: '80px auto' }}>
                <h1 className="events-title">Your Cart</h1>
                <p className="events-subtitle">Review your selected events before registration.</p>

                {cart.length === 0 ? (
                    <div className="events-grid-empty" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <p>Your cart is empty.</p>
                        <button onClick={() => navigate('/events')} className="retry-btn">Browse Events</button>
                    </div>
                ) : (
                    <>
                        <div className="cart-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                            {cart.map((event) => (
                                <div key={event.id} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '2rem 3rem', // Increased horizontal padding
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center', // Ensure vertical centering
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    flexWrap: 'wrap', // Allow wrapping on very small screens
                                    gap: '1rem' // Gap when wrapped
                                }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{event.name}</h3>
                                        <p style={{ color: '#aaa', margin: 0, fontSize: '1rem' }}>{event.department?.department_name || event.department}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <span style={{ color: '#ff9d00', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{event.fee}</span>
                                        <button
                                            onClick={() => removeFromCart(event.id)}
                                            style={{
                                                background: 'rgba(255, 0, 0, 0.2)',
                                                color: '#ff4d4d',
                                                border: '1px solid rgba(255, 0, 0, 0.3)',
                                                padding: '0.5rem 1rem',



                                                borderRadius: '6px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary" style={{
                            marginTop: '3rem',
                            padding: '2rem 8rem',
                            background: 'rgba(255, 215, 0, 0.1)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '2rem'
                        }}>
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ color: '#ffd700', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Total Amount</h2>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>₹{totalFee}</span>
                                    <span style={{ color: '#ddd', fontSize: '1rem' }}>({cart.length} Events)</span>
                                </div>
                            </div>

                            <button style={{
                                background: 'orange',
                                color: '#000',
                                border: 'none',
                                padding: '1rem 3rem',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                minWidth: '200px'
                            }}>
                                Proceed to Register
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
