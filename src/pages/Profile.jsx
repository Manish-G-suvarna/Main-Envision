import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import logo from '../assets/logo.png';
import mainBg from '../assets/main-bg.png';

export default function Profile() {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (Object.values(formData).every(val => val.trim() !== '')) {
            localStorage.setItem('envision_profile_v2', JSON.stringify(formData));
            setIsProfileComplete(true);
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
                    <Link to="/events" className="nav-btn">
                        Events
                        <svg viewBox="0 0 24 24" className="icon" style={{ width: 18, height: 18 }}><path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>
                    </Link>
                </div>
            </nav>

            <div className="profile-glass-container" style={{ position: 'relative', zIndex: 5 }}>
                <h1 style={{ fontSize: '2.5rem', color: '#ffd700', marginBottom: '1rem' }}>Student Profile</h1>

                <div className="profile-header-info" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', color: 'white', margin: 0 }}>{formData.fullName}</h2>
                    <p style={{ color: '#aaa', margin: '0.5rem 0' }}>{formData.usn} | {formData.department}</p>
                    <p style={{ color: '#aaa', margin: 0 }}>{formData.college}</p>
                </div>

                <div className="profile-stats-card" style={{ display: 'flex', gap: '3rem', background: 'rgba(255,255,255,0.05)', padding: '2rem 4rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '3rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff9d00', display: 'block' }}>0</span>
                        <span style={{ fontSize: '1rem', color: '#e0e0e0', textTransform: 'uppercase' }}>Events Registered</span>
                    </div>
                </div>

                <div className="profile-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#ffd700', padding: '0.8rem 2rem', fontSize: '1.1rem', borderBottom: '2px solid #ffd700', cursor: 'pointer' }}>My Events</button>
                    <button style={{ background: 'transparent', border: 'none', color: '#aaa', padding: '0.8rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Certificates</button>
                </div>

                <div className="profile-content-area" style={{ width: '100%', minHeight: '200px', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
                    <p>You haven't registered for any events yet.</p>
                </div>

                {/* Reset Button for Testing */}
                <button
                    onClick={() => {
                        localStorage.removeItem('envision_profile_v2');
                        setIsProfileComplete(false);
                    }}
                    style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#666', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                    Reset Profile (Debug)
                </button>
            </div>
        </div>
    );
}
