import React from 'react';

export default function SiteFooter({ onNavigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col footer-brand-col">
          <div className="site-brand footer-brand">
            <span className="site-brand-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" width="30" height="30">
                <circle cx="24" cy="24" r="22" fill="none" stroke="#e0b84a" strokeWidth="2" />
                <path d="M24 8c-1.5 3-3 5-3 8a3 3 0 0 0 6 0c0-3-1.5-5-3-8Z" fill="#e0b84a" />
                <path d="M24 17v20M17 26c0 6 3 11 7 11s7-5 7-11" stroke="#e0b84a" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="14" r="1.6" fill="#e0b84a" />
              </svg>
            </span>
            <span className="site-brand-text">
              <span className="site-brand-title">सनातन ज्योतिष</span>
              <span className="site-brand-tag">कुंडली मिलान · ज्योतिष · विवाह सेवाएं</span>
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>हमारे बारे में</h4>
          <button type="button" onClick={() => go('about')}>About Us</button>
          <button type="button" onClick={() => go('contact')}>Contact</button>
          <button type="button" onClick={() => go('privacy')}>Privacy Policy</button>
          <button type="button" onClick={() => go('terms')}>Terms &amp; Conditions</button>
        </div>

        <div className="footer-col">
          <h4>ज्योतिष सेवाएं</h4>
          <button type="button" onClick={() => go('kundli')}>Kundli</button>
          <button type="button" onClick={() => go('milan')}>Kundli Matching</button>
          <button type="button" onClick={() => go('rashifal')}>Horoscope</button>
          <button type="button" onClick={() => go('muhurat')}>Muhurat</button>
          <button type="button" onClick={() => go('panchang')}>Panchang</button>
        </div>

        <div className="footer-col">
          <h4>हिंदू कैलेंडर</h4>
          <button type="button" onClick={() => go('calendar')}>आज का पंचांग</button>
          <button type="button" onClick={() => go('calendar')}>मासिक कैलेंडर</button>
          <button type="button" onClick={() => go('calendar')}>त्यौहार</button>
          <button type="button" onClick={() => go('calendar')}>पूर्णिमा / अमावस्या</button>
        </div>

        <div className="footer-col">
          <h4>संपर्क करें</h4>
          <p className="footer-contact-line">✉️ ankit7659@gmail.com</p>
          <a
            className="footer-whatsapp-btn"
            href="https://wa.me/917888426916?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%9C%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%A4%E0%A4%BF%E0%A4%B7%20%E0%A4%B8%E0%A4%B2%E0%A4%BE%E0%A4%B9%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp: 7888426916
          </a>
          <div className="footer-social">
            <span aria-hidden="true">Fb</span>
            <span aria-hidden="true">In</span>
            <span aria-hidden="true">X</span>
            <span aria-hidden="true">Pn</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} सनातन ज्योतिष. सर्वाधिकार सुरक्षित।</p>
        <div className="footer-bottom-links">
          <button type="button" onClick={() => go('privacy')}>Privacy Policy</button>
          <button type="button" onClick={() => go('terms')}>Terms &amp; Conditions</button>
        </div>
      </div>
    </footer>
  );

  function go(id) {
    if (typeof onNavigate === 'function') onNavigate(id);
  }
}
