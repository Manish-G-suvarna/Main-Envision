import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LeafCanvas from './components/LeafCanvas'
import CountdownTimer from './components/CountdownTimer'
import { BentoTilt } from './components/BentoTilt'
import { BentoCard } from './components/BentoCard'
import Footer from './components/Footer'
import './App.css'
import heroTitleImg from './assets/hero-title.png'
import landscapeVideo from './assets/bg-video/landscape.mp4'
import mainBg from './assets/main-bg.png'
import extraImg01 from './assets/all-bg/extra-img-01.png'
import timmerBanner from './assets/timmer-banner.png'
import startingLogo from './assets/Starting-logo.png'
import allEventsBg from './assets/events/all-events.png'
import nonTechBg from './assets/events/non-tech.png'

export default function App() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [videoError, setVideoError] = useState(false)

  // Scroll to top on page load/reload - NOW HANDLED IN LAYOUT
  // Initialize Lenis smooth scroll - NOW HANDLED IN LAYOUT


  // Scroll Detection to hide/show scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="app"
      onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      {/* Background Container */}
      <div className="background-container">
        {/* Top: Video Background */}
        <div className="bg-video-section">
          {!videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="background-video"
              onError={(e) => {
                console.error('Video failed to load:', e)
                setVideoError(true)
              }}
              onLoadedData={() => console.log('Video loaded successfully')}
            >
              <source src={landscapeVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src={mainBg}
              alt="Background"
              className="background-image"
            />
          )}
        </div>

        {/* Bottom: Extra Image Background */}
        <div className="bg-image-section">
          <img
            src={extraImg01}
            alt="Content Background"
            className="background-extra-img"
          />
        </div>
      </div>

      {/* Leaf Animation Overlay */}
      <LeafCanvas />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="main-content">
        <section id="home" className="section hero-section">
          <img src={heroTitleImg} alt="ENVISION" className="hero-title-img" />

          <div className="hero-details">
            <img src={timmerBanner} alt="28th January 2026" className="timmer-banner" />
            <CountdownTimer targetDate="2026-01-28T00:00:00" />

            <img src={startingLogo} alt="Srinivas Institute of Technology" className="hero-institute-logo" />

            {/* Envision Description Box */}
            <div className="hero-description-box">
              <p className="hero-description-text">
                ENVISION is a one-day national-level techno-cultural fest that brings together students, innovators, and creators for an intense celebration of skill, creativity, and competition. Blending cutting-edge technology with vibrant cultural expression, ENVISION features a curated line up of technical challenges, cultural events, and interactive experiences designed to push boundaries and spark inspiration. From problem-solving and innovation to performance and play, the fest captures the spirit of modern youth in a single, high-energy day. Join us at Srinivas Institute of Technology, Valachil Mangaluru-574143 and experience a festival where tradition meets technology and ideas come alive.
              </p>
            </div>

            {/* Date & Event Info Box */}
            <div className="hero-info-box">
              <div className="hero-info-month">FABRUARY</div>
              <div className="hero-info-day">DAY 1</div>
              <div className="hero-info-divider"></div>
              <div className="hero-info-category">Events</div>
            </div>

            {/* Statistics Row */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">01</div>
                <div className="stat-label">DAY OF FUN</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">20+</div>
                <div className="stat-label">EXCITING EVENTS</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1,00,000</div>
                <div className="stat-label">TOTAL PRIZE</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">PARTICIPANTS</div>
              </div>
            </div>

            {/* Events Intro Section */}
            <div className="events-intro">
              <h2 className="events-intro-title">EVENTS YOU CANT MISS</h2>
              <div className="events-intro-divider"></div>
              <p className="events-intro-subtitle">
                One day. Infinite impact. Step into the experience.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="bento-grid-container">
              {/* Row 1: All Events (Wide) */}
              <BentoTilt className="bento-card-wide">
                <BentoCard
                  src={allEventsBg}
                  title="ALL EVENTS"
                  description="Explore every challenge and celebration."
                />
              </BentoTilt>

              {/* Row 2: Mega Events (Left) & Stack (Right) */}
              <div className="bento-grid-row-2">
                {/* Mega Events - Tall */}
                <BentoTilt className="bento-card-tall">
                  <BentoCard
                    src={mainBg}
                    title="MEGA EVENTS"
                    description="The biggest showdowns."
                  />
                </BentoTilt>

                {/* Right Stack */}
                <div className="bento-stack-right">
                  <BentoTilt className="bento-card-standard">
                    <BentoCard
                      src={mainBg}
                      title="TECHNICAL"
                      description="Innovate, build, and conquer."
                    />
                  </BentoTilt>

                  <BentoTilt className="bento-card-standard">
                    <BentoCard
                      src={nonTechBg}
                      title="NON TECHNICAL"
                      description="Creativity beyond code."
                    />
                  </BentoTilt>
                </div>
              </div>
            </div>

            {/* Sponsors Section */}
            <div className="section sponsors-section">
              <h2 className="section-title">OUR SPONSORS</h2>
              <div className="marquee-wrapper">
                <div className="marquee-content">
                  {[...Array(10)].map((_, i) => (
                    <div key={`sponsor-${i}`} className="sponsor-card">
                      <div className="sponsor-content">SPONSOR {i + 1}</div>
                    </div>
                  ))}
                  {/* Duplicate for seamless loop */}
                  {[...Array(10)].map((_, i) => (
                    <div key={`sponsor-dup-${i}`} className="sponsor-card">
                      <div className="sponsor-content">SPONSOR {i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className={`scroll-indicator-container ${showScrollIndicator ? 'visible' : 'hidden'}`}>
            <span className="scroll-text">SCROLL</span>
            <div className="mouse-icon">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
