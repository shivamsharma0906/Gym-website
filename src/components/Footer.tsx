import { useEffect, useRef, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Workouts', href: '#workout-guide' },
    { label: 'Diet Plans', href: '#diet-plans' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const programs = [
    'Strength Training',
    'HIIT Cardio',
    'Yoga & Flexibility',
    'Combat Training',
    'Functional Fitness',
    'Nutrition Coaching',
  ];

  return (
    <footer className="ft" id="footer" ref={footerRef}>
      {/* Background Elements */}
      <div className="ft__bg">
        <div className="ft__bg-orb" />
        <div className="ft__bg-grid" />
      </div>
      <div className="ft__scanline" />

      <div className={`ft__container container${isVisible ? ' ft__container--visible' : ''}`}>
        <div className="ft__grid">
          
          {/* Brand Column */}
          <div className="ft__brand">
            <a href="#hero" className="ft__logo">
              <span className="ft__logo-icon">⚡</span>
              <span className="ft__logo-text">
                LIFT &<span className="ft__logo-accent"> FIT</span>
              </span>
            </a>
            <p className="ft__brand-desc">
              India's premium fitness destination. We blend science, discipline, and aesthetics to forge unbreakable bodies and elite mindsets. Join the iron revolution.
            </p>
            <div className="ft__socials">
              <a href="#" className="ft__social" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="ft__social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="ft__social" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33zM9.75 15.04V8.46l5.75 3.29-5.75 3.29z" />
                </svg>
              </a>
              <a href="#" className="ft__social" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="ft__links-group">
            <h4 className="ft__heading">Navigation</h4>
            <ul className="ft__links">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="ft__link">
                    <span className="ft__link-arrow">►</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Column */}
          <div className="ft__links-group">
            <h4 className="ft__heading">Disciplines</h4>
            <ul className="ft__links">
              {programs.map((program, i) => (
                <li key={i}>
                  <a href="#programs" className="ft__link">
                    <span className="ft__link-arrow">►</span>
                    {program}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="ft__newsletter">
            <h4 className="ft__heading">Join The Legion</h4>
            <p className="ft__newsletter-desc">
              Get elite training protocols, heavy discounts, and nutrition secrets delivered straight to your inbox.
            </p>
            <form className="ft__form" onSubmit={(e) => { e.preventDefault(); alert('Transmission Received. Welcome to LIFT & FIT.'); }}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className="ft__input"
                required
                id="newsletter-email"
              />
              <button type="submit" className="ft__submit" id="newsletter-submit" aria-label="Subscribe">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="ft__bottom">
          <p className="ft__copy">
            © {currentYear} <strong>LIFT & FIT INDIA</strong>. All rights reserved. 🇮🇳
          </p>
          <div className="ft__legal">
            <a href="#" className="ft__legal-link">Privacy Protocol</a>
            <a href="#" className="ft__legal-link">Terms of Combat</a>
            <a href="#" className="ft__legal-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
