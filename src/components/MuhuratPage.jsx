import React, { useState } from 'react';

const CATEGORIES = [
  {
    id: 'vivah',
    icon: '💍',
    title: 'विवाह मुहूर्त',
    note: 'विवाह मुहूर्त निकालते समय वर-वधू दोनों की कुंडली, नक्षत्र-शुद्धि व गुरु-शुक्र तारा बल देखा जाता है। नीचे दी गई तारीखें सामान्य पंचांग आधारित संकेत हैं — अंतिम मुहूर्त हेतु कृपया पंडित/ज्योतिषी से पुष्टि करें।',
    dates: [
      { date: '18 नवंबर 2026', time: '10:15 AM – 12:45 PM', tag: 'शुभ' },
      { date: '25 नवंबर 2026', time: '06:40 AM – 09:10 AM', tag: 'शुभ' },
      { date: '2 दिसंबर 2026', time: '11:00 AM – 01:30 PM', tag: 'शुभ' },
      { date: '7 दिसंबर 2026', time: '05:50 AM – 08:20 AM', tag: 'शुभ' },
    ],
  },
  {
    id: 'griha-pravesh',
    icon: '🏠',
    title: 'गृह प्रवेश मुहूर्त',
    note: 'गृह प्रवेश हेतु सामान्यतः शुक्ल पक्ष, स्थिर लग्न व शुभ वार को प्राथमिकता दी जाती है।',
    dates: [
      { date: '22 सितंबर 2026', time: '11:30 AM – 02:15 PM', tag: 'शुभ' },
      { date: '14 अक्टूबर 2026', time: '09:00 AM – 11:45 AM', tag: 'शुभ' },
      { date: '9 नवंबर 2026', time: '07:15 AM – 09:50 AM', tag: 'शुभ' },
    ],
  },
  {
    id: 'namkaran',
    icon: '👶',
    title: 'नामकरण मुहूर्त',
    note: 'नामकरण संस्कार सामान्यतः जन्म के 11वें या 12वें दिन, शुभ नक्षत्र में किया जाता है।',
    dates: [
      { date: '20 सितंबर 2026', time: '09:45 AM – 11:20 AM', tag: 'शुभ' },
      { date: '4 अक्टूबर 2026', time: '08:30 AM – 10:40 AM', tag: 'शुभ' },
    ],
  },
  {
    id: 'vahan',
    icon: '🚗',
    title: 'वाहन खरीदी मुहूर्त',
    note: 'नया वाहन खरीदते समय शुभ तिथि व चौघड़िया देखना पारंपरिक रूप से लाभकारी माना जाता है।',
    dates: [
      { date: '19 सितंबर 2026', time: '01:15 PM – 03:30 PM', tag: 'शुभ' },
      { date: '11 अक्टूबर 2026', time: '10:00 AM – 12:20 PM', tag: 'शुभ' },
    ],
  },
  {
    id: 'bhoomi-pujan',
    icon: '🌱',
    title: 'भूमि पूजन मुहूर्त',
    note: 'निर्माण कार्य आरंभ करने से पूर्व भूमि पूजन हेतु शुभ मुहूर्त देखा जाता है।',
    dates: [
      { date: '26 सितंबर 2026', time: '08:45 AM – 10:30 AM', tag: 'शुभ' },
      { date: '16 अक्टूबर 2026', time: '07:00 AM – 09:15 AM', tag: 'शुभ' },
    ],
  },
  {
    id: 'vyapar',
    icon: '💼',
    title: 'नया व्यवसाय / दुकान उद्घाटन',
    note: 'व्यवसाय आरंभ हेतु शुभ मुहूर्त में गणेश-लक्ष्मी पूजन करना शुभ माना जाता है।',
    dates: [
      { date: '2 अक्टूबर 2026', time: '12:00 PM – 02:00 PM', tag: 'शुभ' },
      { date: '21 अक्टूबर 2026', time: '10:30 AM – 12:45 PM', tag: 'शुभ' },
    ],
  },
];

export default function MuhuratPage({ onNavigate }) {
  const [active, setActive] = useState(CATEGORIES[0].id);
  const cat = CATEGORIES.find((c) => c.id === active);

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>👑 शुभ मुहूर्त</h1>
        <p>विवाह, गृह प्रवेश, नामकरण व अन्य शुभ कार्यों हेतु आगामी शुभ मुहूर्त यहाँ देखें।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="tabs" style={{ marginBottom: 20 }}>
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={`tab-btn${active === c.id ? ' active' : ''}`}
              onClick={() => setActive(c.id)}
            >
              {c.icon} {c.title}
            </button>
          ))}
        </div>

        <div className="card">
          <h3>{cat.icon} {cat.title}</h3>
          <p className="muted small">{cat.note}</p>
          <table className="data-table">
            <thead>
              <tr><th>तारीख</th><th>शुभ समय</th><th>स्थिति</th></tr>
            </thead>
            <tbody>
              {cat.dates.map((d, i) => (
                <tr key={i}>
                  <td>{d.date}</td>
                  <td>{d.time}</td>
                  <td><span className="dosha-badge dosha-no">{d.tag}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>अपनी व्यक्तिगत कुंडली अनुसार मुहूर्त चाहिए?</h3>
          <p className="muted small">
            ऊपर दी गई तारीखें सामान्य पंचांग-आधारित हैं। अपनी कुंडली के अनुसार व्यक्तिगत व सर्वाधिक शुभ मुहूर्त
            जानने के लिए अपनी जन्म कुंडली बनवाएं या हमारे ज्योतिषी से सीधे बात करें।
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary" onClick={() => onNavigate('kundli')}>अपनी कुंडली देखें</button>
            <a
              className="btn-link"
              href="https://wa.me/917888426916?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%B6%E0%A5%81%E0%A4%AD%20%E0%A4%AE%E0%A5%81%E0%A4%B9%E0%A5%82%E0%A4%B0%E0%A5%8D%E0%A4%A4%20%E0%A4%9C%E0%A4%BE%E0%A4%A8%E0%A4%A8%E0%A4%BE%20%E0%A4%B9%E0%A5%88"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp पर ज्योतिषी से पूछें →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
