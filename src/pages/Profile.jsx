import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import logo from '../assets/logo.png';
import mainBg from '../assets/main-bg.png';
import CountdownTimer from '../components/CountdownTimer';
import { useCart } from '../context/CartContext';

export default function Profile() {
    const { cart, removeFromCart } = useCart();
    // State to track if profile is completed
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        gender: '',
        email: '',
        college: '',
        department: '',
        degree: '',
        usn: '' // Register Number
    });

    // Check local storage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('envision_profile_v2');
        if (savedProfile) {
            setFormData(JSON.parse(savedProfile));
            setIsProfileComplete(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (Object.values(formData).every(val => val.trim() !== '')) {
            try {
                // Pointing to Node.js Server
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('envision_profile_v2', JSON.stringify(formData));
                    setIsProfileComplete(true);
                    alert('Registration Successful!');
                } else {
                    alert(data.message || 'Registration failed. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please check your connection.');
            }
        } else {
            alert('Please fill in all fields');
        }
    };
    // If profile is NOT complete, show the Registration Split Screen
    if (!isProfileComplete) {
        return (
            <div className="profile-root">
                <div className="profile-split-container">
                    {/* Left Panel - Form */}
                    <div className="profile-left-panel">
                        <Link to="/" className="back-home-absolute">
                            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                            Back
                        </Link>

                        <div className="form-header">
                            <h2 className="form-title">Join the Celebration</h2>
                            <p className="form-subtitle">Begin your journey into our vibrant community</p>
                        </div>

                        <form onSubmit={handleSubmit} className="profile-form-grid">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-input"
                                    placeholder="Your Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    className="form-input"
                                    placeholder="Your Mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select
                                    name="gender"
                                    className="form-select"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">College Name</label>
                                <input
                                    type="text"
                                    name="college"
                                    className="form-input"
                                    placeholder="Search for your college..."
                                    value={formData.college}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    className="form-input"
                                    placeholder="e.g. Computer Science"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    className="form-input"
                                    placeholder="BE, BTECH, MBA, etc."
                                    value={formData.degree}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Register Number</label>
                                <input
                                    type="text"
                                    name="usn"
                                    className="form-input"
                                    placeholder="College ID / USN"
                                    value={formData.usn}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="submit-btn-red">
                                Join the Celebration
                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                            </button>
                        </form>
                    </div>

                    {/* Right Panel - Visuals */}
                    <div className="profile-right-panel">
                        <img src={logo} alt="Envision Logo" className="profile-logo-img" />
                        <h1 className="brand-text">ENVISION 2026</h1>
                    </div>
                </div>
            </div>
        );
    }

    // If profile IS complete, show the Dashboard View (Refined from previous version)
    return (
        <div className="profile-root profile-view-wrapper" style={{ backgroundImage: `url(${mainBg})` }}>
            <div className="events-overlay"></div> {/* Reuse overlay from global/events if available or mimic it */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>

            {/* Navigation */}
            <nav className="profile-nav" style={{ width: '95%', maxWidth: '1400px', display: 'flex', justifyContent: 'space-between', padding: '2rem 0', zIndex: 10 }}>
                <Link to="/" className="nav-btn">
                    <svg viewBox="0 0 24 24" className="icon" style={{ width: 18, height: 18 }}><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    Go to Home
                </Link>
                <div className="nav-right">
                    <Link to="/cart" className="nav-btn">
                        View Cart
                        <svg viewBox="0 0 24 24" className="icon" style={{ width: 18, height: 18 }}><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                    </Link>
                </div>
            </nav>

            <div className="profile-glass-container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ fontSize: '3.0rem', color: '#ffd700', marginBottom: '1rem', textAlign: 'center' }}>Student Profile</h1>
                <div style={{
                    width: '160px',
                    height: '160px',
                    margin: '0 auto 1.5rem',
                    border: '2px solid #ffd700',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                }}>
                    <img
                        src="https://loremflickr.com/320/320/samurai"
                        alt="Samurai"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <div className="profile-header-info" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>{formData.fullName}</h2>
                    <p style={{ color: '#aaa', margin: '0.5rem 0' }}>{formData.usn} | {formData.department}</p>
                    <p style={{ color: '#aaa', margin: 0 }}>{formData.college}</p>
                </div>

                <div className="profile-stats-card" style={{ display: 'flex', gap: '4rem', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 3rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '3rem' }}>
                    <div style={{ textAlign: 'center', minWidth: '200px' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#ff9d00', display: 'block', lineHeight: 1 }}>{cart.length}</span>
                        <span style={{ fontSize: '0.9rem', color: '#e0e0e0', textTransform: 'uppercase', marginTop: '0.5rem', display: 'block' }}>Events Registered</span>
                    </div>

                    <div style={{ height: '80px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem', marginLeft: '7rem' }}>
                        <div style={{ transform: 'scale(0.8)' }}>
                            <CountdownTimer targetDate="2026-01-28T00:00:00" />
                        </div>
                    </div>
                </div>

                <div className="profile-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#ffd700', padding: '0.8rem 2rem', fontSize: '1.1rem', borderBottom: '2px solid #ffd700', cursor: 'pointer' }}>My Events</button>
                </div>

                <div className="profile-content-area" style={{ width: '100%', minHeight: '200px', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#888' }}>
                    {cart.length === 0 ? (
                        <p style={{ textAlign: 'center', margin: 'auto' }}>You haven't registered for any events yet.</p>
                    ) : (
                        <div className="profile-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
                            {cart.map((event) => (
                                <div key={event.id} className="profile-event-card" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{event.name}</h3>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{event.department}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#ff9d00', fontWeight: 'bold' }}>₹{event.fee}</span>
                                        <button
                                            onClick={() => removeFromCart(event.id)}
                                            style={{ background: 'rgba(255, 0, 0, 0.2)', color: '#ff4d4d', border: '1px solid rgba(255, 0, 0, 0.3)', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
