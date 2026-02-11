import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventCard.css';
import { addToCart, isAuthenticated } from '../services/api';

export const EventCard = ({ event }) => {
    const navigate = useNavigate();
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setCursorPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseEnter = () => setHoverOpacity(1);
    const handleMouseLeave = () => setHoverOpacity(0);

    const handleRegisterClick = (e) => {
        e.preventDefault();

        // Check if user is authenticated
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: '/events', message: 'Please log in to register for events' } });
            return;
        }

        try {
            // Add event to cart
            addToCart({
                id: event.id,
                name: event.name,
                fee: event.fee,
                type: event.type,
                department: event.department,
                description: event.description,
                isMegaEvent: event.isMegaEvent
            });

            // Show success notification
            setIsAdded(true);
            setShowNotification(true);

            // Hide notification after 2 seconds
            setTimeout(() => {
                setShowNotification(false);
                setIsAdded(false);
            }, 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Get type badge styling
    const getTypeBadge = () => {
        return event.type === 'Technical'
            ? { bg: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa', icon: '⚡' }
            : { bg: 'rgba(236, 72, 153, 0.3)', text: '#f472b6', icon: '🎨' };
    };

    const badge = getTypeBadge();

    return (
        <div
            ref={cardRef}
            className={`event-card ${event.isMegaEvent ? 'mega-event' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Gradient hover effect */}
            <div
                className="event-card-glow"
                style={{
                    opacity: hoverOpacity,
                    background: `radial-gradient(600px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,157,0,0.15), transparent 40%)`,
                }}
            />

            {/* Mega Event Badge */}
            {event.isMegaEvent === 1 && (
                <div className="mega-badge">
                    🌟 MEGA EVENT
                </div>
            )}

            {/* Header */}
            <div className="event-card-header">
                <h3 className="event-name">{event.name}</h3>
                <div className="event-fee">₹{event.fee}</div>
            </div>

            {/* Department */}
            <div className="event-department">📍 {event.department}</div>

            {/* Description */}
            <p className="event-description">
                {event.description || 'An exciting event awaits! More details coming soon.'}
            </p>

            {/* Footer */}
            <div className="event-card-footer">
                <div className="event-type-badge" style={{
                    background: badge.bg,
                    color: badge.text
                }}>
                    <span className="type-icon">{badge.icon}</span>
                    {event.type}
                </div>
                <button
                    className={`register-btn ${isAdded ? 'added' : ''}`}
                    onClick={handleRegisterClick}
                    title={isAdded ? 'Added to cart!' : 'Add to cart'}
                >
                    <svg viewBox="0 0 24 24" className="register-icon">
                        <path fill="currentColor" d="M10.368 19.102c.349 1.049 1.011 1.086 1.478.086l5.309-11.375c.467-1.002.034-1.434-.967-.967l-11.376 5.308c-1.001.467-.963 1.129.085 1.479l4.103 1.367 1.368 4.102z"></path>
                    </svg>
                    {isAdded ? '✓ Added' : 'Register'}
                </button>
            </div>

            {/* Success Notification */}
            {showNotification && (
                <div className="event-notification">
                    <span>✓ Added to cart!</span>
                </div>
            )}
        </div>
    );
};
