import { useState, useEffect } from 'react'

export default function Preloader({ onComplete }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fast initial load simulation
        const timer = setTimeout(() => {
            setLoading(false);
            if (onComplete) onComplete();
        }, 800); // 0.8s initial load

        return () => clearTimeout(timer);
    }, [onComplete])

    if (!loading) return null

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: '#000',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
    )
}
