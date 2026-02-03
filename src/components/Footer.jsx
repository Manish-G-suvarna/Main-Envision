import './Footer.css';
import footerBg from '../assets/footer-img.png';

export default function Footer() {
    return (
        <div className="footer-wrapper">
            <img src={footerBg} alt="Footer Banner" className="footer-backdrop-img" />
            <footer className="footer-section">
                <div className="footer-content">
                    {/* Left Column: Address */}
                    <div className="footer-col footer-left">
                        <h2 className="footer-title">Join the ENVISION Vibe!</h2>
                        <div className="footer-address">
                            <p>Srinivas Engineering College</p>
                            <p></p>
                            <p>DK District, Karnataka, India - 574219</p>
                        </div>
                    </div>

                    {/* Center Column: Socials & Links */}
                    <div className="footer-col footer-center">
                        <div className="social-icons">
                            {/* Building Icon */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></svg></a>
                            {/* LinkedIn */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg></a>
                            {/* Instagram */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg></a>
                            {/* Facebook */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"></path></svg></a>
                            {/* YouTube */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.5l5.75 3.26z"></path></svg></a>
                            {/* Location */}
                            <a href="#" className="social-link"><svg viewBox="0 0 24 24" className="footer-icon"><path fill="currentColor" d="M12 2c3.86 0 7 3.14 7 7c0 5.25-7 13-7 13S5 14.25 5 9c0-3.86 3.14-7 7-7m0 2a5 5 0 0 0-5 5c0 1 0 3 4 8c2.4-3.5 6-6.4 4-8a5 5 0 0 0-5-5m0 3a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"></path></svg></a>
                        </div>
                        <div className="center-links">
                            <a href="#">Team</a>
                            <a href="#">Events</a>
                            <a href="#">Hackathon</a>
                        </div>
                    </div>

                    {/* Right Column: Contact */}
                    <div className="footer-col footer-right">
                        <h3 className="footer-contact-title">Contact Us</h3>

                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" className="contact-icon"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                            <span></span>
                        </div>

                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" className="contact-icon"><path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>
                            <span></span>
                        </div>

                        <div className="contact-item">
                            <svg viewBox="0 0 24 24" className="contact-icon"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
                            <a href="mailto:aakriti@canaraengineering.in"></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-links">
                        <a href="#">PRIVACY POLICY</a>
                        <a href="#">CANCELLATION AND REFUNDS</a>
                        <a href="#">TERMS & CONDITIONS</a>
                        <a href="#">CONTACT</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
