import React from 'react';

export const VIVAH_SERVICES = [
  { icon: '💞', title: 'Kundli Matching', desc: 'वर-वधू की कुंडली मिलाकर 36 गुण मिलान रिपोर्ट प्राप्त करें', tab: 'milan' },
  { icon: '💍', title: 'Marriage Muhurat', desc: 'विवाह हेतु आगामी शुभ मुहूर्त देखें', tab: 'muhurat' },
  { icon: '🔺', title: 'Mangal Dosha', desc: 'अपनी कुंडली में मंगल दोष (मांगलिक) जांचें', tab: 'mangal-dosha' },
  { icon: '🐍', title: 'Nadi Dosha', desc: 'वर-वधू के नाड़ी कूट व नाड़ी दोष की जांच करें', tab: 'nadi-dosha' },
  { icon: '🪔', title: 'Guna Milan', desc: 'अष्टकूट के आधार पर 36 गुणों का पूर्ण मिलान देखें', tab: 'milan' },
  { icon: '📅', title: 'Horoscope Analysis', desc: 'जन्म कुंडली, ग्रह व भावों का विस्तृत विश्लेषण', tab: 'kundli' },
  { icon: '🤝', title: 'Compatibility Analysis', desc: 'वर-वधू के स्वभाव व अनुकूलता की गहराई से जांच', tab: 'milan' },
  { icon: '💒', title: 'Marriage Prediction', desc: 'सप्तम भाव व दशा अनुसार विवाह से जुड़े संकेत जानें', tab: 'marriage-prediction' },
];

export default function VivahServices({ onNavigate }) {
  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>विवाह एवं ज्योतिष सेवाएं</h1>
        <p>कुंडली मिलान से लेकर दोष जांच व विवाह मुहूर्त तक — विवाह से जुड़ी सभी ज्योतिषीय सेवाएं एक ही जगह।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="services-grid">
          {VIVAH_SERVICES.map((s) => (
            <button type="button" key={s.title} className="service-card" onClick={() => onNavigate(s.tab)}>
              <span className="service-icon">{s.icon}</span>
              <h4>{s.title}</h4>
              <p className="muted small">{s.desc}</p>
            </button>
          ))}
        </div>

        <div className="home-astro-band" style={{ marginTop: 28, borderRadius: 18 }}>
          <div className="home-astro-inner">
            <div className="home-astro-text">
              <h2>किसी अनुभवी ज्योतिषी से सीधे बात करना चाहते हैं?</h2>
              <p>अपनी कुंडली, मिलान या मुहूर्त से जुड़ी शंका WhatsApp पर पूछें — विशेषज्ञ ज्योतिषी से तुरंत जुड़ें।</p>
            </div>
            <a
              className="home-astro-btn"
              href="https://wa.me/917888426916?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%9C%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%A4%E0%A4%BF%E0%A4%B7%20%E0%A4%B8%E0%A4%B2%E0%A4%BE%E0%A4%B9%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="home-astro-icon" aria-hidden="true">💬</span>
              WhatsApp पर ज्योतिषी बुक करें — 7888426916
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
