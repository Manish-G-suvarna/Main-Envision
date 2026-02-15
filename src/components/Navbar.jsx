import { useRef, useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import gsap from 'gsap'
import './Navbar.css'
import Torch from './Torch'

// Icons no longer used as components if all are images now
import homeIconImg from '../assets/nav-icon/home-icon.png'
import profileIconImg from '../assets/nav-icon/profile-icon.png'
import eventIconImg from '../assets/nav-icon/event-icon.png'
import logoImg from '../assets/ENVISION_logo.png'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeLink, setActiveLink] = useState('home')
    const navContainerRef = useRef(null)
    const isAutoScrolling = useRef(false) // Track if scroll is initiated by click

    const [isNavVisible, setIsNavVisible] = useState(true)
    const lastScrollY = useRef(0) // Use ref for tracking last scroll position to avoid re-renders just for logic

    const navLinks = useMemo(() => [
        { id: 'home', label: 'Home', iconImg: homeIconImg },
        { id: 'events', label: 'Event', iconImg: eventIconImg },
        { id: 'profile', label: 'Profile', iconImg: profileIconImg },
    ], [])

    const handleLinkClick = (id, e) => {
        e.preventDefault()
        setActiveLink(id)

        if (id === 'events') {
            navigate('/events')
            return
        }
        if (id === 'profile') {
            navigate('/profile')
            return
        }
        if (id === 'home') {
            if (location.pathname !== '/') {
                navigate('/')
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
            return
        }

        isAutoScrolling.current = true
        // Reset after sufficient time for scroll to complete (adjust if needed)
        setTimeout(() => {
            isAutoScrolling.current = false
        }, 1000)
    }

    // Handle scroll behavior - hide on scroll down, show on scroll up
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY
                    const prevScrollY = lastScrollY.current;

                    // Navbar visibility logic
                    if (currentScrollY === 0) {
                        setIsNavVisible(true)
                        navContainerRef.current?.classList.remove('floating-nav')
                    } else if (currentScrollY > prevScrollY) {
                        if (!isAutoScrolling.current) {
                            setIsNavVisible(false)
                        }
                        navContainerRef.current?.classList.add('floating-nav')
                    } else if (currentScrollY < prevScrollY) {
                        setIsNavVisible(true)
                        navContainerRef.current?.classList.add('floating-nav')
                    }

                    lastScrollY.current = currentScrollY;

                    // Scroll Spy Logic
                    if (!isAutoScrolling.current) {
                        const homeSection = document.getElementById('home')
                        const eventSection = document.getElementById('events')
                        const scrollOffset = window.innerHeight * 0.3

                        if (eventSection && window.scrollY + scrollOffset >= eventSection.offsetTop) {
                            setActiveLink('events')
                        } else if (homeSection) {
                            setActiveLink('home')
                        }
                    }

                    ticking = false;
                });

                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Animate navbar visibility with GSAP
    useEffect(() => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches
        const hiddenY = isMobile ? 150 : -150 // Slide down if mobile, up if desktop

        gsap.to(navContainerRef.current, {
            y: isNavVisible ? 0 : hiddenY,
            opacity: isNavVisible ? 1 : 0,
            pointerEvents: isNavVisible ? 'auto' : 'none',
            duration: 0.3,
            ease: 'power2.out'
        })
    }, [isNavVisible])

    // ... (rest of component logic)

    // ... (rest of component logic)

    return (
        <nav ref={navContainerRef} className="navbar">
            <div className="navbar-banner">
                {/* ... (existing logo and torch) */}
                <img src={logoImg} alt="Envision" className="navbar-logo" width="150" height="50" />
                <Torch className="torch-left" />
                <ul className="navbar-links">
                    {navLinks.map((link) => (
                        <li key={link.id}>
                            <a
                                href={`/${link.id === 'home' ? '' : link.id}`}
                                className={activeLink === link.id ? 'active' : ''}
                                onClick={(e) => handleLinkClick(link.id, e)}
                            >
                                <span className="nav-icon-container">
                                    {link.iconImg ? (
                                        <img src={link.iconImg} alt={link.label} className="nav-icon" />
                                    ) : (
                                        link.Icon && <link.Icon className="nav-icon" />
                                    )}
                                </span>
                                <span className="nav-label">{link.label}</span>
                            </a>
                        </li>
                    ))}


                </ul>
                <Torch className="torch-right" />
                <button className="register-login-btn navbar-btn" onClick={() => navigate('/admin')}>
                    REGISTER / LOGIN
                </button>
            </div>
        </nav>
    )
}
