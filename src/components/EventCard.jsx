import { useState, useRef } from 'react';
import './EventCard.css';

import { useCart } from '../context/CartContext';

export const EventCard = ({ event }) => {
    // Guard clause for safety
    if (!event) return null;

    const { addToCart, cart } = useCart();
    const isInCart = cart.some(item => item.id === event.id);

    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [hoverOpacity, setHoverOpacity] = useState(0);
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

    // Unified premium style (Gold/Warm)
    const badge = { bg: 'rgba(255, 157, 0, 0.2)', text: '#ff9d00', icon: '⚡' };

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
                    Details
                </div>
                <button
                    className={`register-btn ${isInCart ? 'added' : ''}`}
                    onClick={() => {
                        if (isInCart) return; // Or navigate to cart?
                        addToCart(event);
                    }}
                    style={{
                        background: isInCart ? 'rgba(72, 187, 120, 0.2)' : undefined, // Green tint if added
                        borderColor: isInCart ? '#48bb78' : undefined,
                        color: isInCart ? '#48bb78' : undefined
                    }}
                >
                    <svg viewBox="0 0 24 24" className="register-icon">
                        {isInCart ? (
                            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /> // Checkmark
                        ) : (
                            <path fill="currentColor" d="M10.368 19.102c.349 1.049 1.011 1.086 1.478.086l5.309-11.375c.467-1.002.034-1.434-.967-.967l-11.376 5.308c-1.001.467-.963 1.129.085 1.479l4.103 1.367 1.368 4.102z"></path>
                        )}
                    </svg>
                    {isInCart ? 'Added' : 'Register'}
                </button>
            </div>
        </div>
    );
};
