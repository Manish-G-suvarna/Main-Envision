import React from 'react';
import './SamuraiCard.css';

const SamuraiCard = ({ title, subtitle, onClick, className = '' }) => {
    return (
        <div className={`samurai-card ${className}`} onClick={onClick}>
            {/* Corner Accents */}
            <div className="corner-accent top-left"></div>
            <div className="corner-accent bottom-right"></div>

            {/* Icon (Katana SVG or similar) */}
            <svg className="samurai-icon" viewBox="0 0 24 24">
                <path d="M19.5,3.09L15,7.59V7.5L4,18.5V21H6.5L17.5,10H17.41L21.91,5.5L19.5,3.09M20.91,6.5L17.5,9.91V9.5H15.09L18.5,6.09L20.91,6.5Z" />
            </svg>

            <div className="samurai-content">
                <h3 className="samurai-title">{title}</h3>
                <p className="samurai-subtitle">{subtitle}</p>
            </div>
        </div>
    );
};

export default SamuraiCard;
