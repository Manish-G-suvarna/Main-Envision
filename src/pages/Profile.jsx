import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import mainBg from '../assets/main-bg.png';
import {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserOrders,
    logoutUser,
    isAuthenticated,
    getCurrentUser,
} from '../services/api';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // Edit Profile Form State
    const [editFormData, setEditFormData] = useState({
        name: '',
        phone: '',
        college: '',
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Change Password Form State
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Check authentication and load user data
    useEffect(() => {
        const checkAuth = async () => {
            if (!isAuthenticated()) {
                navigate('/');
                return;
            }

            try {
                setLoading(true);
                setError('');

                // Get user from localStorage first
                const currentUser = getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setEditFormData({
                        name: currentUser.name || '',
                        phone: currentUser.phone || '',
                        college: currentUser.college || '',
                    });
                }

                // Try to fetch updated profile from backend
                const profileData = await getUserProfile();
                if (profileData) {
                    setUser(profileData);
                    setEditFormData({
                        name: profileData.name || '',
                        phone: profileData.phone || '',
                        college: profileData.college || '',
                    });
                }
            } catch (err) {
                console.error('Error loading profile:', err);
                // Don't show error if user is still logged in locally
                if (!getCurrentUser()) {
                    setError('Unable to load profile. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    // Handle profile edit
    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await updateUserProfile(editFormData);
            setUser({ ...user, ...editFormData });
            setIsEditingProfile(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        setPasswordFormData({
            ...passwordFormData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await changePassword(
                passwordFormData.currentPassword,
                passwordFormData.newPassword
            );
            setPasswordFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setIsChangingPassword(false);
            setSuccessMessage('Password changed successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    if (loading && !user) {
        return (
            <div className="profile-root profile-view-wrapper" style={{ backgroundImage: `url(${mainBg})` }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>
                <div className="profile-glass-container" style={{ position: 'relative', zIndex: 5 }}>
                    <p style={{ color: '#aaa', textAlign: 'center' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-root profile-view-wrapper" style={{ backgroundImage: `url(${mainBg})` }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1 }}></div>

            {/* Navigation */}
            <nav className="profile-nav" style={{ width: '95%', maxWidth: '1400px', display: 'flex', justifyContent: 'space-between', padding: '2rem 0', zIndex: 10 }}>
                <Link to="/" className="nav-btn">
                    <svg viewBox="0 0 24 24" className="icon" style={{ width: 18, height: 18 }}><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    Home
                </Link>
                <div className="nav-right">
                    <Link to="/events" className="nav-btn">
                        Events
                        <svg viewBox="0 0 24 24" className="icon" style={{ width: 18, height: 18 }}><path fill="currentColor" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>
                    </Link>
                </div>
            </nav>

            <div className="profile-glass-container" style={{ position: 'relative', zIndex: 5, maxWidth: '1200px' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', background: 'linear-gradient(90deg, #ff9d00, #ff4d00)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                        My Profile
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Manage your account and registrations</p>
                </div>

                {/* Messages */}
                {error && (
                    <div style={{
                        background: 'rgba(220, 53, 69, 0.2)',
                        border: '1px solid rgba(220, 53, 69, 0.5)',
                        color: '#ff6b6b',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                    }}>
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div style={{
                        background: 'rgba(40, 167, 69, 0.2)',
                        border: '1px solid rgba(40, 167, 69, 0.5)',
                        color: '#51cf66',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                    }}>
                        ✓ {successMessage}
                    </div>
                )}

                {/* Tabs */}
                <div className="profile-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'profile' ? '#ff9d00' : '#aaa',
                            padding: '0.8rem 1.5rem',
                            fontSize: '1rem',
                            borderBottom: activeTab === 'profile' ? '2px solid #ff9d00' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    >
                        👤 Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'orders' ? '#ff9d00' : '#aaa',
                            padding: '0.8rem 1.5rem',
                            fontSize: '1rem',
                            borderBottom: activeTab === 'orders' ? '2px solid #ff9d00' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    >
                        📋 Registrations
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: activeTab === 'security' ? '#ff9d00' : '#aaa',
                            padding: '0.8rem 1.5rem',
                            fontSize: '1rem',
                            borderBottom: activeTab === 'security' ? '2px solid #ff9d00' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                    >
                        🔐 Security
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="profile-section">
                        {/* User Info Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '2rem',
                            marginBottom: '2rem',
                        }}>
                            <h2 style={{ color: '#ff9d00', marginBottom: '1.5rem', fontSize: '1.3rem' }}>User Information</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Name</p>
                                    <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>{user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Email</p>
                                    <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>{user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Phone</p>
                                    <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>{user?.phone || 'Not set'}</p>
                                </div>
                                <div>
                                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.3rem' }}>College</p>
                                    <p style={{ color: 'white', fontSize: '1.1rem', fontWeight: '500' }}>{user?.college || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile Form */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '2rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#ff9d00', fontSize: '1.3rem' }}>Edit Profile</h2>
                                {!isEditingProfile && (
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        style={{
                                            background: 'rgba(255, 157, 0, 0.2)',
                                            border: '1px solid #ff9d00',
                                            color: '#ff9d00',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#ff9d00';
                                            e.target.style.color = '#000';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 157, 0, 0.2)';
                                            e.target.style.color = '#ff9d00';
                                        }}
                                    >
                                        ✎ Edit
                                    </button>
                                )}
                            </div>

                            {isEditingProfile ? (
                                <form onSubmit={handleProfileSubmit}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editFormData.name}
                                                onChange={handleEditChange}
                                                className="form-input"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editFormData.phone}
                                                onChange={handleEditChange}
                                                className="form-input"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>College</label>
                                        <input
                                            type="text"
                                            name="college"
                                            value={editFormData.college}
                                            onChange={handleEditChange}
                                            className="form-input"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                background: 'linear-gradient(90deg, #ff9d00, #ff4d00)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.7rem 2rem',
                                                borderRadius: '6px',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                transition: 'all 0.3s',
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#aaa',
                                                padding: '0.7rem 2rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p style={{ color: '#aaa' }}>Click "Edit" to update your profile information.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="profile-section">
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '2rem',
                        }}>
                            <h2 style={{ color: '#ff9d00', marginBottom: '1.5rem', fontSize: '1.3rem' }}>Your Registrations</h2>
                            {orders && orders.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            style={{
                                                background: 'rgba(0,0,0,0.3)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                padding: '1.5rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <p style={{ color: '#ff9d00', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    Order #{order.order_id}
                                                </p>
                                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                                    Status: <span style={{ color: '#51cf66' }}>{order.payment_status}</span>
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                                                    ₹{order.total_amount}
                                                </p>
                                                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>
                                    No registrations yet. Visit the Events page to register! 🎉
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <div className="profile-section">
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '2rem',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ color: '#ff9d00', fontSize: '1.3rem' }}>Change Password</h2>
                                {!isChangingPassword && (
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        style={{
                                            background: 'rgba(255, 157, 0, 0.2)',
                                            border: '1px solid #ff9d00',
                                            color: '#ff9d00',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#ff9d00';
                                            e.target.style.color = '#000';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 157, 0, 0.2)';
                                            e.target.style.color = '#ff9d00';
                                        }}
                                    >
                                        🔄 Change
                                    </button>
                                )}
                            </div>

                            {isChangingPassword ? (
                                <form onSubmit={handlePasswordSubmit}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordFormData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            placeholder="Enter your current password"
                                            style={{ width: '100%' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordFormData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            placeholder="Enter new password"
                                            style={{ width: '100%' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ color: '#e0e0e0', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>Confirm Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordFormData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input"
                                            placeholder="Confirm new password"
                                            style={{ width: '100%' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                background: 'linear-gradient(90deg, #ff9d00, #ff4d00)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.7rem 2rem',
                                                borderRadius: '6px',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                transition: 'all 0.3s',
                                                opacity: loading ? 0.6 : 1,
                                            }}
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsChangingPassword(false)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                color: '#aaa',
                                                padding: '0.7rem 2rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
                                    Click "Change" to update your password.
                                </p>
                            )}
                        </div>

                        {/* Logout Button */}
                        <div style={{ marginTop: '2rem' }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: 'rgba(220, 53, 69, 0.2)',
                                    border: '1px solid rgba(220, 53, 69, 0.5)',
                                    color: '#ff6b6b',
                                    padding: '0.8rem 2rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(220, 53, 69, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                                }}
                            >
                                🚪 Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
