import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const isFirstRender = useRef(true);
    const prevPath = useRef(location.pathname);

    // On route change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (prevPath.current !== location.pathname) {
            prevPath.current = location.pathname;
            setLoading(true);

            // Simple timeout to simulate fast load or wait for content
            // In a real app, you might track actual resource loading or suspense
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500); // 0.5s fast load
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    if (!loading) return null;

    return (
        <div className="page-transition-overlay" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            pointerEvents: 'auto',
            backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent black 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(5px)' // Nice blur effect
        }}>
            <div className="simple-spinner"></div>
            <style>{`
                .simple-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 0.8s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
