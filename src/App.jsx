import { useState, Suspense, lazy, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import LeafCanvas from './components/LeafCanvas'
import CountdownTimer from './components/CountdownTimer'
import { BentoTilt } from './components/BentoTilt'
import { BentoCard } from './components/BentoCard'
import Footer from './components/Footer'
import ScrollIndicator from './components/ScrollIndicator'
import ScrollReveal from './components/ScrollReveal'
import './App.css'
import heroTitleImg from './assets/hero-title.png'
import landscapeVideo from './assets/bg-video/optimized_bg.mp4'
import mainBg from './assets/main-bg.png'
import extraImg01 from './assets/all-bg/extra-img-01.png'
import timmerBanner from './assets/timmer-banner.png'
import extraImg02 from './assets/all-bg/extra-img-02.png'
import extraImg03 from './assets/all-bg/extra-img-03.png'
import extraImg04 from './assets/all-bg/extra-img-04.png'
import extraImg05 from './assets/all-bg/extra-img-05.png'

import allEventsBg from './assets/events/all-events.png'
import nonTechBg from './assets/events/non-tech.png'
import Masonry from './components/Masonry';
// Lazy load DomeGallery
const DomeGallery = lazy(() => import('./components/DomeGallery'));
import Preloader from './components/Preloader';

export default function App() {
  const [videoError, setVideoError] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.play().catch(e => console.log("Auto-play prevented (expected on some browsers):", e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.1 } // Play when 10% visible
    );

    observer.observe(videoElement);

    return () => {
      if (videoElement) observer.unobserve(videoElement);
    };
  }, []);

  return (
    <div
      className="app"
    // onContextMenu={(e) => e.preventDefault()} // Disable right-click
    >
      <Preloader />
      {showGallery && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
          <button
            onClick={() => setShowGallery(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 10000,
              background: 'rgba(0,0,0,0.5)',
              color: '#ffd700',
              border: '1px solid #ffd700',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 'bold'
            }}
          >
            CLOSE GALLERY
          </button>
          <Suspense fallback={<div>Loading Gallery...</div>}>
            <DomeGallery
              fit={0.8}
              minRadius={600}
              maxVerticalRotationDeg={0}
              segments={34}
              dragDampening={2}
              grayscale
            />
          </Suspense>
        </div>
      )}

      {/* Background Container */}
      <div className="background-container">
        {/* Top: Video Background */}
        <div className="bg-video-section bg-video">
          {!videoError ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster={mainBg}
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
          <img src={heroTitleImg} alt="ENVISION" className="hero-title-img" width="800" height="300" />

          <div className="timer-bg-container">
            <img
              src={extraImg01}
              alt=""
              className="timer-bg-image"
              fetchpriority="high"
            />
            <ScrollReveal>
              <img src={timmerBanner} alt="28th January 2026" className="timmer-banner" width="600" height="150" />
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <CountdownTimer targetDate="2026-04-16T00:00:00" />
            </ScrollReveal>
          </div>

          <div className="content-bg-container">
            <img
              src={extraImg02}
              alt=""
              className="content-bg-image"
            />
            <ScrollReveal className="hero-institute-name">
              <h4>SRINIVAS INSTITUTE OF TECHNOLOGY</h4>
              <p>presents</p>
              <h1>ENVISION</h1>
            </ScrollReveal>

            {/* Envision Description Box */}
            <ScrollReveal className="hero-description-box">
              <p className="hero-description-text">
                ENVISION is a one-day national-level techno-cultural fest that brings together students, innovators, and creators for an intense celebration of skill, creativity, and competition. Blending cutting-edge technology with vibrant cultural expression, ENVISION features a curated lineup of technical challenges, cultural events, and interactive experiences designed to push boundaries and spark inspiration. From problem-solving and innovation to performance and play, the fest captures the spirit of modern youth in a single, high-energy day. Join us at Srinivas Institute of Technology, Valachil, and experience a festival where tradition meets technology and ideas come alive.
              </p>
            </ScrollReveal>

            {/* Date & Event Info Box */}
            <ScrollReveal delay={100} className="hero-info-box">
              <div className="hero-info-month">APRIL</div>
              <div className="hero-info-day">DAY 1</div>
              <div className="hero-info-divider"></div>
              <div className="hero-info-category">Events</div>
            </ScrollReveal>

            {/* Statistics Row */}
            <ScrollReveal delay={150} className="hero-stats">
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
            </ScrollReveal>
          </div>

          <div className="events-section">
            <img src={extraImg03} alt="" className="events-section-bg-image" />
            {/* Events Intro Section */}
            <ScrollReveal className="events-intro">
              <h2 className="events-intro-title">EVENTS YOU CANT MISS</h2>
              <div className="events-intro-divider"></div>
              <p className="events-intro-subtitle">
                One day. Infinite impact. Step into the experience.
              </p>
            </ScrollReveal>

            {/* Bento Grid Layout */}
            <ScrollReveal className="bento-grid-container">
              {/* Row 1: All Events (Wide) */}
              <BentoTilt className="bento-card-wide">
                <BentoCard
                  src={allEventsBg}
                  title="ALL EVENTS"
                  description="Explore every challenge and celebration."
                  category="All Categories"
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
                    category="All Categories"
                  />
                </BentoTilt>

                {/* Right Stack */}
                <div className="bento-stack-right">
                  <BentoTilt className="bento-card-standard">
                    <BentoCard
                      src={mainBg}
                      title="DETAILS"
                      description="Innovate, build, and conquer."
                      category="Technical"
                    />
                  </BentoTilt>

                  <BentoTilt className="bento-card-standard">
                    <BentoCard
                      src={nonTechBg}
                      title="DETAILS"
                      description="Creativity beyond code."
                      category="Non-Technical"
                    />
                  </BentoTilt>
                </div>
              </div>
            </ScrollReveal>
          </div>
          <div className="sponsors-section-container">
            {/* Sponsors Section */}
            <div className="section sponsors-section">
              <img src={extraImg04} alt="" className="sponsors-section-bg-image" />
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
          {/* Masonry Section */}
          <div className="masonry-section-container">
            <img src={extraImg05} alt="" className="masonry-section-bg-image" />
            <div className="masonry-section ">
              <Masonry
                items={[
                  { id: 1, img: allEventsBg, height: 400, url: '#' },
                  { id: 2, img: mainBg, height: 300, url: '#' },
                  { id: 3, img: nonTechBg, height: 500, url: '#' },
                  { id: 4, img: extraImg01, height: 350, url: '#' },
                  { id: 5, img: extraImg02, height: 450, url: '#' },
                  { id: 6, img: heroTitleImg, height: 300, url: '#' },
                ]}
                ease="power3.out"
                duration={0.6}
                stagger={0.05}
                animateFrom="bottom"
                scaleOnHover
                hoverScale={0.95}
                blurToFocus
                colorShiftOnHover={false}
              />
              <div
                className="view-gallery-btn"
                onClick={() => setShowGallery(true)}
              >
                VIEW GALLERY
              </div>
            </div>
          </div>


          {/* Scroll Indicator */}
          <ScrollIndicator />
        </section>

        <Footer />
      </main>
    </div>
  )
}
