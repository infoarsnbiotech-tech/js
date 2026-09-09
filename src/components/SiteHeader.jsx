import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'kundli', label: 'कुंडली' },
  { id: 'milan', label: 'कुंडली मिलान' },
  { id: 'rashifal', label: 'राशिफल' },
  { id: 'panchang', label: 'पंचांग' },
  { id: 'palm-scan', label: 'हस्त रेखा स्कैन' },
  { id: 'calendar', label: 'हिंदू कैलेंडर' },
  { id: 'muhurat', label: 'मुहूर्त' },
  { id: 'vivah', label: 'विवाह सेवाएं' },
  { id: 'blog', label: 'ब्लॉग' },
  { id: 'contact', label: 'संपर्क' },
];

export default function SiteHeader({ activeTab, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function go(id) {
    setMenuOpen(false);
    onNavigate(id);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button type="button" className="site-brand" onClick={() => go('home')}>
          <span className="site-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="34" height="34">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#c9a227" strokeWidth="2" />
              <path d="M24 8c-1.5 3-3 5-3 8a3 3 0 0 0 6 0c0-3-1.5-5-3-8Z" fill="#c9a227" />
              <path d="M24 17v20M17 26c0 6 3 11 7 11s7-5 7-11" stroke="#c9a227" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="24" cy="14" r="1.6" fill="#c9a227" />
            </svg>
          </span>
          <span className="site-brand-text">
            <span className="site-brand-title">सनातन ज्योतिष</span>
            <span className="site-brand-tag">कुंडली मिलान · ज्योतिष · विवाह सेवाएं</span>
          </span>
        </button>

        <nav className={`site-nav${menuOpen ? ' open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`site-nav-link${activeTab === item.id ? ' active' : ''}`}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" className="site-cta-btn" onClick={() => go('milan')}>
          ♥ कुंडली मिलान करें
        </button>

        <button
          type="button"
          className="site-menu-toggle"
          aria-label="मेनू खोलें"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
