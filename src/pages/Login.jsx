import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';
import { loginUser } from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get redirect URL (from checkout or other protected routes)
    const redirectTo = location.state?.from?.pathname || '/profile';

    const [formData, setFormData] = useState({
        email: '', // Backend can accept USN or email
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.trim()) {
            setError('USN or Email is required');
            return;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Call login API
            // Backend should accept either USN or email
            const response = await loginUser(formData.email, formData.password);

            // JWT already stored by loginUser function
            // Redirect to profile or checkout
            navigate(redirectTo);
        } catch (err) {
            setError(err.message || 'Login failed. Check your credentials.');
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
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Login to continue your Envision journey</p>
                    </div>

                    {error && (
                        <div className="auth-alert error-alert">
                            <span className="alert-icon">✕</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        {/* USN / Email */}
                        <div className="form-group">
                            <label className="form-label">USN or Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="4PI19CS001 or john@example.com"
                                disabled={loading}
                                autoFocus
                                required
                            />
                            <small>Enter your Student ID (USN) or email address</small>
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
                        </div>

                        {/* Remember Me */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                id="remember"
                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                            />
                            <label htmlFor="remember" style={{ cursor: 'pointer', margin: 0 }}>
                                Keep me logged in
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-submit-btn"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Register here
                            </Link>
                        </p>
                        <p style={{ marginTop: '0.8rem', fontSize: '0.85rem' }}>
                            <Link to="/" className="auth-link">
                                Forgot password?
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Panel - Info */}
                <div className="auth-panel">
                    <div className="auth-panel-content">
                        <h2 className="auth-panel-title">Login Benefits</h2>
                        <ul className="auth-panel-list">
                            <li>🎫 Save your cart and registrations</li>
                            <li>📋 View your event registrations</li>
                            <li>💳 Manage your payments</li>
                            <li>🎓 Access your digital certificates</li>
                            <li>👤 Update your profile anytime</li>
                            <li>⚡ Quick checkout process</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
