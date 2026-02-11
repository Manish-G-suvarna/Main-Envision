import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import cloudBg from '../assets/Loading/loading_cloud_bg.png';
import cloudFg from '../assets/Loading/cloud.png';
import './PageTransition.css';

export default function PageTransition() {
    const location = useLocation();
    const [phase, setPhase] = useState('idle'); // 'idle' | 'closing' | 'opening'
    const [visible, setVisible] = useState(false);
    const isFirstRender = useRef(true);
    const prevPath = useRef(location.pathname);

    // On route change (skip first render — Suspense handles that)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (prevPath.current !== location.pathname) {
            prevPath.current = location.pathname;
            setPhase('closing');
            setVisible(true);
        }
    }, [location.pathname]);

    // Handle phases with timeouts since we use static images now
    useEffect(() => {
        let timeout;
        if (phase === 'closing') {
            // Show "closing" state for a bit, then switch to opening
            timeout = setTimeout(() => {
                setPhase('opening');
            }, 1500); // Duration for "closing"
        } else if (phase === 'opening') {
            // Show "opening" state for a bit, then hide
            timeout = setTimeout(() => {
                setPhase('idle');
                setVisible(false);
            }, 1500); // Duration for "opening"
        }
        return () => clearTimeout(timeout);
    }, [phase]);

    if (!visible) return null;

    return (
        <div className="page-transition-overlay">
            <img src={cloudBg} alt="" className="cloud-bg" />
            <img src={cloudFg} alt="Loading..." className="cloud-fg" />
        </div>
    );
}
