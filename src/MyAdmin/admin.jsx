import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Admin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalRegistrations: 0 });
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Check login status on mount
    useEffect(() => {
        const storedLogin = localStorage.getItem('isAdminLoggedIn');
        if (storedLogin === 'true') {
            setIsLoggedIn(true);
            fetchData();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                setIsLoggedIn(true);
                fetchData();
            } else {
                alert(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("Login request failed:", err);
            // Fallback
            if (email === 'myadmin@envision.in' && password === 'admin') {
                console.warn("Using fallback login");
                localStorage.setItem('isAdminLoggedIn', 'true');
                setIsLoggedIn(true);
                fetchData();
            } else {
                alert('Login failed. Ensure backend is running.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        setIsLoggedIn(false);
        setOrders([]);
        setGroupedEvents([]);
        setStats({ totalOrders: 0, totalRevenue: 0, totalRegistrations: 0 });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Master List of Events
            const eventsRes = await fetch('http://localhost:5000/api/events');
            const eventsData = await eventsRes.json();

            // 2. Fetch Orders
            const ordersRes = await fetch('http://localhost:5000/api/admin/orders');
            const ordersData = await ordersRes.json();

            // Initialize map with ALL events (so empty ones exist)
            const eventsMap = {};

            // If events fetch worked, populate initial map
            if (Array.isArray(eventsData)) {
                eventsData.forEach(evt => {
                    eventsMap[evt.name] = [];
                });
            }

            if (ordersData.success) {
                setOrders(ordersData.orders);

                // Populate participants
                ordersData.orders.forEach(order => {
                    order.events.forEach(event => {
                        // If event wasn't in master list for some reason, creating it
                        if (!eventsMap[event.name]) {
                            eventsMap[event.name] = [];
                        }
                        eventsMap[event.name].push({
                            name: order.name,
                            email: order.email,
                            contact: order.phone,
                            college: order.college,
                            status: order.status,
                            orderId: order.orderId
                        });
                    });
                });
            }

            // Fetch Stats
            const statsRes = await fetch('http://localhost:5000/api/admin/stats');
            const statsData = await statsRes.json();
            if (statsData.success) {
                setStats(statsData.stats);
            } else {
                // Fallback calculation
                const revenue = ordersData.orders?.reduce((acc, curr) => acc + parseFloat(curr.totalAmount || 0), 0) || 0;
                setStats({
                    totalOrders: ordersData.orders?.length || 0,
                    totalRevenue: revenue,
                    totalRegistrations: ordersData.orders?.reduce((acc, curr) => acc + curr.events.length, 0) || 0
                });
            }

            // Convert events map to array and sort mainly by non-empty first, then name
            const eventsList = Object.keys(eventsMap).map(key => ({
                name: key,
                participants: eventsMap[key]
            })).sort((a, b) => {
                // Sort events with participants first
                if (a.participants.length > 0 && b.participants.length === 0) return -1;
                if (a.participants.length === 0 && b.participants.length > 0) return 1;
                return a.name.localeCompare(b.name);
            });

            setGroupedEvents(eventsList);

        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const [groupedEvents, setGroupedEvents] = useState([]);

    if (!isLoggedIn) {
        return (
            <div className="admin-login-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}>
                <style>{`
                    @keyframes glow {
                        0%, 100% { box-shadow: 0 0 20px rgba(255, 185, 8, 0.3), 0 0 40px rgba(255, 185, 8, 0.1); }
                        50% { box-shadow: 0 0 30px rgba(255, 185, 8, 0.5), 0 0 60px rgba(255, 185, 8, 0.2); }
                    }
                `}</style>
                <div className="glass-card" style={{
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '420px',
                    borderRadius: '20px',
                    background: 'rgba(20, 20, 30, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 185, 8, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
                    animation: 'glow 3s ease-in-out infinite'
                }}>
                    <h2 style={{
                        color: '#FFB908',
                        textAlign: 'center',
                        marginBottom: '2.5rem',
                        fontFamily: 'Rajdhani',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        letterSpacing: '2px'
                    }}>ADMIN PORTAL</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,185,8,0.3)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    fontSize: '1rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#FFB908'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,185,8,0.3)'}
                            />
                        </div>
                        <div>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,185,8,0.3)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    outline: 'none',
                                    transition: 'all 0.3s',
                                    fontSize: '1rem'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#FFB908'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,185,8,0.3)'}
                            />
                        </div>
                        <button type="submit" style={{
                            padding: '1.1rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #FFB908, #FF8C00)',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            letterSpacing: '1px'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(255, 185, 8, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            ACCESS DASHBOARD
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0515 50%, #0a0a0a 100%)',
            color: '#fff',
            fontFamily: 'Rajdhani, sans-serif'
        }}>
            <style>{`
                @keyframes shine {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .stat-card {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(255, 185, 8, 0.3) !important;
                }
                .stat-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 185, 8, 0.1), transparent);
                    transition: left 0.5s;
                }
                .stat-card:hover::before {
                    left: 100%;
                }
                .event-btn {
                    transition: all 0.2s ease;
                    position: relative;
                }
                .event-btn:hover {
                    background: rgba(255, 185, 8, 0.1) !important;
                    transform: translateX(5px);
                }
                .event-btn::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 0;
                    background: #FFB908;
                    transition: height 0.2s;
                }
                .event-btn:hover::before {
                    height: 70%;
                }
                table tr {
                    transition: background 0.2s ease;
                }
                table tr:hover {
                    background: rgba(255, 185, 8, 0.05) !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in {
                    animation: fadeIn 0.5s ease forwards;
                }
            `}</style>

            {/* Header */}
            <header style={{
                height: '70px',
                borderBottom: '1px solid rgba(255,185,8,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                background: 'rgba(10,10,10,0.9)',
                backdropFilter: 'blur(20px)',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <h3 style={{
                    margin: 0,
                    color: '#FFB908',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(255, 185, 8, 0.5)'
                }}>⚡ ENVISION ADMIN</h3>
                <button onClick={handleLogout} style={{
                    background: 'transparent',
                    border: '2px solid rgba(255,185,8,0.5)',
                    color: '#FFB908',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s',
                    fontSize: '0.95rem'
                }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255,185,8,0.2)';
                        e.target.style.borderColor = '#FFB908';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'rgba(255,185,8,0.5)';
                    }}
                >
                    LOGOUT
                </button>
            </header>

            <div style={{ display: 'flex', marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '250px',
                    borderRight: '1px solid rgba(255,185,8,0.2)',
                    padding: '2rem 1rem',
                    background: 'rgba(10,5,15,0.5)',
                    backdropFilter: 'blur(10px)',
                    overflowY: 'auto',
                    maxHeight: 'calc(100vh - 70px)'
                }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => { setActiveTab('dashboard'); setSelectedEvent(null); }}
                            style={{
                                textAlign: 'left',
                                padding: '1rem',
                                background: activeTab === 'dashboard' ? 'linear-gradient(90deg, rgba(255, 185, 8, 0.2), transparent)' : 'transparent',
                                border: 'none',
                                borderLeft: activeTab === 'dashboard' ? '3px solid #FFB908' : '3px solid transparent',
                                color: activeTab === 'dashboard' ? '#FFB908' : '#aaa',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal',
                                fontSize: '1rem',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => {
                                if (activeTab !== 'dashboard') {
                                    e.target.style.background = 'rgba(255, 185, 8, 0.05)';
                                    e.target.style.color = '#FFB908';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeTab !== 'dashboard') {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#aaa';
                                }
                            }}
                        >
                            📊 Dashboard Overview
                        </button>
                        <div style={{
                            padding: '1.5rem 0 0.5rem 1rem',
                            color: '#666',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>
                            🎯 Events
                        </div>
                        {groupedEvents.map(event => (
                            <button
                                key={event.name}
                                onClick={() => { setActiveTab('event'); setSelectedEvent(event); }}
                                className="event-btn"
                                style={{
                                    textAlign: 'left',
                                    padding: '0.8rem 1rem',
                                    background: selectedEvent?.name === event.name ? 'rgba(255, 185, 8, 0.15)' : 'transparent',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: selectedEvent?.name === event.name ? '#FFB908' : '#888',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: selectedEvent?.name === event.name ? 'bold' : 'normal'
                                }}
                            >
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {event.name}
                                </span>
                                <span style={{
                                    background: event.participants.length > 0 ? 'linear-gradient(135deg, #FFB908, #FF8C00)' : '#333',
                                    padding: '3px 8px',
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    color: event.participants.length > 0 ? '#000' : '#666',
                                    fontWeight: 'bold',
                                    minWidth: '25px',
                                    textAlign: 'center'
                                }}>
                                    {event.participants.length}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem', background: 'rgba(0,0,0,0.2)' }}>

                    {activeTab === 'dashboard' && (
                        <div className="fade-in">
                            <div style={{
                                position: 'sticky',
                                top: '70px',
                                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0515 50%, #0a0a0a 100%)',
                                zIndex: 10,
                                paddingBottom: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                <h2 style={{
                                    marginBottom: '2rem',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #FFB908, #FF8C00)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '1px'
                                }}>📈 Overview</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    <div className="stat-card" style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(255, 185, 8, 0.1), rgba(255, 140, 0, 0.05))',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255, 185, 8, 0.3)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        <div style={{ color: '#FFB908', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                            💰 Total Revenue
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FFB908', marginTop: '0.5rem', textShadow: '0 0 20px rgba(255, 185, 8, 0.3)' }}>
                                            ₹{stats.totalRevenue.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05))',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(139, 92, 246, 0.3)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        <div style={{ color: '#8B5CF6', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                            📦 Total Orders
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8B5CF6', marginTop: '0.5rem', textShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
                                            {stats.totalOrders}
                                        </div>
                                    </div>
                                    <div className="stat-card" style={{
                                        padding: '2rem',
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                                    }}>
                                        <div style={{ color: '#22C55E', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                            🎫 Event Registrations
                                        </div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22C55E', marginTop: '0.5rem', textShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
                                            {stats.totalRegistrations}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h3 style={{
                                marginBottom: '1.5rem',
                                fontSize: '1.5rem',
                                color: '#FFB908',
                                fontWeight: 'bold'
                            }}>📋 Recent Orders</h3>
                            <div style={{
                                marginTop: '1rem',
                                background: 'rgba(20, 20, 30, 0.6)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 185, 8, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(255, 185, 8, 0.2)', background: 'rgba(255, 185, 8, 0.05)' }}>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold', fontSize: '0.9rem' }}>Order ID</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold', fontSize: '0.9rem' }}>Name</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold', fontSize: '0.9rem' }}>Amount</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold', fontSize: '0.9rem' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 10).map((order, idx) => (
                                            <tr key={order.orderId} style={{
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                opacity: 0,
                                                animation: `fadeIn 0.5s ease ${idx * 0.1}s forwards`
                                            }}>
                                                <td style={{ padding: '1.2rem', fontFamily: 'monospace', color: '#aaa', fontSize: '0.9rem' }}>{order.orderId}</td>
                                                <td style={{ padding: '1.2rem', color: '#fff', fontWeight: '500' }}>{order.name}</td>
                                                <td style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>₹{order.totalAmount}</td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        background: order.status === 'PAID'
                                                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))'
                                                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                                                        color: order.status === 'PAID' ? '#22C55E' : '#EF4444',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        border: order.status === 'PAID'
                                                            ? '1px solid rgba(34, 197, 94, 0.3)'
                                                            : '1px solid rgba(239, 68, 68, 0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {order.status === 'PAID' ? '✓ ' : '✗ '}{order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                                    No orders yet
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'event' && selectedEvent && (
                        <div className="fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #FFB908, #FF8C00)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>{selectedEvent.name}</h2>
                                <div style={{
                                    padding: '0.8rem 1.5rem',
                                    background: 'linear-gradient(135deg, rgba(255, 185, 8, 0.2), rgba(255, 140, 0, 0.1))',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 185, 8, 0.3)'
                                }}>
                                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Total Participants: </span>
                                    <span style={{ color: '#FFB908', fontWeight: 'bold', fontSize: '1.2rem' }}>{selectedEvent.participants.length}</span>
                                </div>
                            </div>

                            <div style={{
                                background: 'rgba(20, 20, 30, 0.6)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                border: '1px solid rgba(255, 185, 8, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                            }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(255, 185, 8, 0.2)', background: 'rgba(255, 185, 8, 0.05)' }}>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>Name</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>College</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>Contact</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>Email</th>
                                            <th style={{ padding: '1.2rem', color: '#FFB908', fontWeight: 'bold' }}>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEvent.participants.map((p, idx) => (
                                            <tr key={idx} style={{
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                                opacity: 0,
                                                animation: `fadeIn 0.5s ease ${idx * 0.05}s forwards`
                                            }}>
                                                <td style={{ padding: '1.2rem', color: '#fff', fontWeight: '500' }}>{p.name}</td>
                                                <td style={{ padding: '1.2rem', color: '#aaa' }}>{p.college}</td>
                                                <td style={{ padding: '1.2rem', fontFamily: 'monospace', color: '#aaa' }}>{p.contact}</td>
                                                <td style={{ padding: '1.2rem', color: '#aaa', fontSize: '0.9rem' }}>{p.email}</td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <span style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        background: p.status === 'PAID'
                                                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))'
                                                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                                                        color: p.status === 'PAID' ? '#22C55E' : '#EF4444',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        border: p.status === 'PAID'
                                                            ? '1px solid rgba(34, 197, 94, 0.3)'
                                                            : '1px solid rgba(239, 68, 68, 0.3)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {p.status === 'PAID' ? '✓ ' : '✗ '}{p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedEvent.participants.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                                                    No registrations yet for this event
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Admin;
