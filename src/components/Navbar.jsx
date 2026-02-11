import { useRef, useState, useEffect } from 'react' // Consolidation if needed, but just replacing relevant lines
import { useNavigate, useLocation } from 'react-router-dom'

import gsap from 'gsap'
import './Navbar.css'
import Torch from './Torch'
import { getCartCount, isAuthenticated } from '../services/api'

// Icons no longer used as components if all are images now
// import { EventsIcon } from './NavIcons'
import homeIconImg from '../assets/nav-icon/home-icon.png'
import profileIconImg from '../assets/nav-icon/profile-icon.png'
import eventIconImg from '../assets/nav-icon/event-icon.png'
import logoImg from '../assets/logo.png'

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeLink, setActiveLink] = useState('home')
    const navContainerRef = useRef(null)
    const isAutoScrolling = useRef(false) // Track if scroll is initiated by click


    const [isNavVisible, setIsNavVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [cartCount, setCartCount] = useState(0)
    const [userAuthenticated, setUserAuthenticated] = useState(false)

    const navLinks = [
        { id: 'home', label: 'Home', iconImg: homeIconImg },
        { id: 'events', label: 'Event', iconImg: eventIconImg },
        { id: 'profile', label: 'Profile', iconImg: profileIconImg },
    ]

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

    // Update cart count and authentication status
    useEffect(() => {
        setCartCount(getCartCount())
        setUserAuthenticated(isAuthenticated())

        // Listen for cart updates
        const handleCartUpdate = (event) => {
            setCartCount(event.detail.length)
        }

        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
    }, [])

    // Handle cart button click
    const handleCartClick = (e) => {
        e.preventDefault()
        navigate('/cart')
    }

    // Handle login/register button click
    const handleAuthClick = (e) => {
        e.preventDefault()
        if (isAuthenticated()) {
            navigate('/profile')
        } else {
            navigate('/login')
        }
    }

    // Handle scroll behavior - hide on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Navbar visibility logic
            if (currentScrollY === 0) {
                setIsNavVisible(true)
                navContainerRef.current?.classList.remove('floating-nav')
            } else if (currentScrollY > lastScrollY) {
                if (!isAutoScrolling.current) {
                    setIsNavVisible(false)
                }
                navContainerRef.current?.classList.add('floating-nav')
            } else if (currentScrollY < lastScrollY) {
                setIsNavVisible(true)
                navContainerRef.current?.classList.add('floating-nav')
            }
            setLastScrollY(currentScrollY)

            // Scroll Spy Logic
            if (!isAutoScrolling.current) {
                // Profile doesn't have a section, so we keep it if manually selected until another section is hit?
                // Or maybe just Home and Events for now as per icons.

                // Simple check for Home and Events
                const homeSection = document.getElementById('home')
                const eventSection = document.getElementById('events')

                // Offset to trigger active state a bit earlier
                const scrollOffset = window.innerHeight * 0.3

                if (eventSection && window.scrollY + scrollOffset >= eventSection.offsetTop) {
                    setActiveLink('events')
                } else if (homeSection) {
                    // Default to home if above events (and assuming home is at top)
                    setActiveLink('home')
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

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

    return (
        <nav ref={navContainerRef} className="navbar">
            <div className="navbar-banner">
                <img src={logoImg} alt="Envision" className="navbar-logo" />
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

                {userAuthenticated && cartCount > 0 && (
                    <button
                        onClick={handleCartClick}
                        className="cart-btn navbar-btn"
                        title="Go to cart"
                    >
                        <svg viewBox="0 0 24 24" className="cart-icon">
                            <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        <span className="cart-count">{cartCount}</span>
                    </button>
                )}

                <button
                    onClick={handleAuthClick}
                    className="register-login-btn navbar-btn"
                >
                    {userAuthenticated ? 'PROFILE' : 'REGISTER / LOGIN'}
                </button>
            </div>
        </nav>
    )
}
