import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { registerUser } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        usn: '', // USN as unique identifier (not primary key)
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
        if (!formData.phone.trim()) return 'Phone number is required';
        if (!/^\d{10}$/.test(formData.phone)) return 'Phone must be 10 digits';
        if (!formData.college.trim()) return 'College name is required';
        if (!formData.usn.trim()) return 'USN is required';
        if (!formData.password.trim()) return 'Password is required';
        if (formData.password.length < 6) return 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Call register API
            const response = await registerUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                password: formData.password,
            });

            // Auto-login user (JWT already stored by API)
            setSuccess('✓ Registration successful! Redirecting to your profile...');

            // Redirect to profile after 2 seconds
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-container">
                <div className="auth-card">
                    <Link to="/" className="auth-back-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                        </svg>
                        Back
                    </Link>

                    <div className="auth-header">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join Envision 2026 to register for amazing events</p>
                    </div>

                    {error && (
                        <div className="auth-alert error-alert">
                            <span className="alert-icon">✕</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-alert success-alert">
                            <span className="alert-icon">✓</span>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="John Doe"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="john@example.com"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="9876543210"
                                disabled={loading}
                                maxLength="10"
                                required
                            />
                            <small>Must be 10 digits</small>
                        </div>

                        {/* College */}
                        <div className="form-group">
                            <label className="form-label">College Name</label>
                            <input
                                type="text"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="MIT"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* USN - Unique Identifier */}
                        <div className="form-group">
                            <label className="form-label">USN (Student ID)</label>
                            <input
                                type="text"
                                name="usn"
                                value={formData.usn}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="4PI19CS001"
                                disabled={loading}
                                required
                            />
                            <small>Your unique student number (used for login)</small>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                disabled={loading}
                                required
                            />
                            <small>At least 6 characters</small>
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="••••••••"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Panel - Benefits */}
                <div className="auth-panel">
                    <div className="auth-panel-content">
                        <h2 className="auth-panel-title">Why Join Envision?</h2>
                        <ul className="auth-panel-list">
                            <li>🎯 Participate in 20+ amazing events</li>
                            <li>🏆 Win exciting prizes and recognition</li>
                            <li>🤝 Network with like-minded people</li>
                            <li>💡 Learn new skills and technologies</li>
                            <li>🎨 Showcase your talent and creativity</li>
                            <li>📜 Get digital certificates</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
