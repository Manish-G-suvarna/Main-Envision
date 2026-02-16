import { useState, useEffect } from 'react';

export default function ScrollIndicator() {
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 50) {
                        setShowScrollIndicator(false);
                    } else {
                        setShowScrollIndicator(true);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`scroll-indicator-container ${showScrollIndicator ? 'visible' : 'hidden'}`}>
            <span className="scroll-text">SCROLL</span>
            <div className="mouse-icon">
                <div className="scroll-dot"></div>
            </div>
        </div>
    );
}
