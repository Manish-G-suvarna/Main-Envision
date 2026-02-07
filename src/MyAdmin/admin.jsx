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
                background: '#000',
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}>
                <div className="glass-card" style={{
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                }}>
                    <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '2rem', fontFamily: 'Rajdhani' }}>ADMIN LOGIN</h2>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: '#fff',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <button type="submit" style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(45deg, #FFB908, #FF8C00)',
                            color: '#000',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            transition: 'transform 0.2s'
                        }}>
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard" style={{
            minHeight: '100vh',
            background: '#050505',
            color: '#fff',
            fontFamily: 'Rajdhani, sans-serif'
        }}>
            {/* Header */}
            <header style={{
                height: '70px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 100
            }}>
                <h3 style={{ margin: 0, color: '#FFB908' }}>ENVISION ADMIN</h3>
                <button onClick={handleLogout} style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                }}>
                    LOGOUT
                </button>
            </header>

            <div style={{ display: 'flex', marginTop: '70px', minHeight: 'calc(100vh - 70px)' }}>
                {/* Sidebar */}
                <aside style={{
                    width: '250px',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    padding: '2rem 1rem',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => { setActiveTab('dashboard'); setSelectedEvent(null); }}
                            style={{
                                textAlign: 'left',
                                padding: '1rem',
                                background: activeTab === 'dashboard' ? 'rgba(255, 185, 8, 0.1)' : 'transparent',
                                border: 'none',
                                borderLeft: activeTab === 'dashboard' ? '3px solid #FFB908' : '3px solid transparent',
                                color: activeTab === 'dashboard' ? '#FFB908' : '#aaa',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Dashboard Overview
                        </button>
                        <div style={{ padding: '1rem 0 0.5rem 1rem', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                            Events
                        </div>
                        {groupedEvents.map(event => (
                            <button
                                key={event.name}
                                onClick={() => { setActiveTab('event'); setSelectedEvent(event); }}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.8rem 1rem',
                                    background: selectedEvent?.name === event.name ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    border: 'none',
                                    color: selectedEvent?.name === event.name ? '#fff' : '#888',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <span>{event.name}</span>
                                <span style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                    {event.participants.length}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '2rem' }}>

                    {activeTab === 'dashboard' && (
                        <div>
                            <h2 style={{ marginBottom: '2rem' }}>Overview</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                                <div className="stat-card" style={{ padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Total Revenue</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFB908', marginTop: '0.5rem' }}>
                                        ₹{stats.totalRevenue.toLocaleString()}
                                    </div>
                                </div>
                                <div className="stat-card" style={{ padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Total Orders</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginTop: '0.5rem' }}>
                                        {stats.totalOrders}
                                    </div>
                                </div>
                                <div className="stat-card" style={{ padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                                    <div style={{ color: '#888', fontSize: '0.9rem' }}>Event Registrations</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff', marginTop: '0.5rem' }}>
                                        {stats.totalRegistrations}
                                    </div>
                                </div>
                            </div>

                            <h3>Recent Orders</h3>
                            <div style={{ marginTop: '1rem', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #222', background: '#151515' }}>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Order ID</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Name</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Amount</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map(order => (
                                            <tr key={order.orderId} style={{ borderBottom: '1px solid #222' }}>
                                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{order.orderId}</td>
                                                <td style={{ padding: '1rem' }}>{order.name}</td>
                                                <td style={{ padding: '1rem' }}>₹{order.totalAmount}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        background: order.status === 'PAID' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                                        color: order.status === 'PAID' ? '#0f0' : '#f55',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'event' && selectedEvent && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0 }}>{selectedEvent.name}</h2>
                                <div style={{ color: '#888' }}>
                                    Total Participants: <span style={{ color: '#fff' }}>{selectedEvent.participants.length}</span>
                                </div>
                            </div>

                            <div style={{ background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #222', background: '#151515' }}>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Name</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>College</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Contact</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Email</th>
                                            <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEvent.participants.map((p, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                                                <td style={{ padding: '1rem' }}>{p.name}</td>
                                                <td style={{ padding: '1rem', color: '#aaa' }}>{p.college}</td>
                                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{p.contact}</td>
                                                <td style={{ padding: '1rem', color: '#aaa' }}>{p.email}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        background: p.status === 'PAID' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                                        color: p.status === 'PAID' ? '#0f0' : '#f55',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {selectedEvent.participants.length === 0 && (
                                            <tr>
                                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                                    No registrations yet.
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
