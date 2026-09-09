import React, { useMemo, useState } from 'react';
import { calculatePanchang } from '../utils/panchang.js';
import { RASHI_NAMES } from '../utils/astro.js';
import { VIVAH_SERVICES } from './VivahServices.jsx';
import { BLOG_POSTS as ALL_BLOG_POSTS } from './BlogPage.jsx';

const RASHI_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const RASHI_KEYWORDS = [
  ['प्रेम', 'कॅरियर', 'धन'],
  ['प्रेम', 'स्वास्थ्य', 'धन'],
  ['प्रेम', 'कॅरियर', 'यात्रा'],
  ['प्रेम', 'परिवार', 'धन'],
  ['प्रेम', 'कॅरियर', 'सम्मान'],
  ['प्रेम', 'स्वास्थ्य', 'कार्य'],
  ['प्रेम', 'साझेदारी', 'धन'],
  ['प्रेम', 'रहस्य', 'धन'],
  ['प्रेम', 'यात्रा', 'भाग्य'],
  ['प्रेम', 'कॅरियर', 'स्थिरता'],
  ['प्रेम', 'मित्रता', 'नवाचार'],
  ['प्रेम', 'अध्यात्म', 'कल्पना'],
];
const RASHI_STARS = [4, 3, 5, 3, 4, 3, 4, 5, 3, 4, 3, 4];

const SERVICES = [
  { icon: '📜', title: 'कुंडली बनाएं', desc: 'जन्म विवरण से अपनी जन्म कुंडली प्राप्त करें', tab: 'kundli' },
  { icon: '💞', title: 'कुंडली मिलान', desc: 'वर-वधू की कुंडली मिलाएं', tab: 'milan' },
  { icon: '🪔', title: 'गुण मिलान', desc: 'अष्टकूट के आधार पर 36 गुणों का मिलान', tab: 'milan' },
  { icon: '👑', title: 'विवाह मुहूर्त', desc: 'शुभ विवाह मुहूर्त जानें', tab: 'muhurat' },
  { icon: '🕉️', title: 'जन्म कुंडली विश्लेषण', desc: 'ग्रहों और भावों का विस्तृत विश्लेषण', tab: 'kundli' },
  { icon: '🔱', title: 'दोष जांच', desc: 'मंगल दोष आदि की जानकारी', tab: 'kundli' },
  { icon: '🖐️', title: 'हस्त रेखा स्कैन', desc: 'हथेली स्कैन करें और भविष्यवाणी पाएं', tab: 'palm-scan' },
];

const MUHURAT_ITEMS = [
  { icon: '💍', label: 'विवाह मुहूर्त', time: '10:15 AM – 12:45 PM' },
  { icon: '🏠', label: 'गृह प्रवेश', time: '11:30 AM – 02:15 PM' },
  { icon: '🐄', label: 'नामकरण', time: '09:45 AM – 11:20 AM' },
  { icon: '🚗', label: 'वाहन खरीदी', time: '01:15 PM – 03:30 PM' },
  { icon: '🌱', label: 'भूमि पूजन', time: '08:45 AM – 10:30 AM' },
  { icon: '💼', label: 'नया व्यवसाय', time: '12:00 PM – 02:00 PM' },
];

const BLOG_POSTS = ALL_BLOG_POSTS.slice(0, 3).map((p) => ({ id: p.id, title: p.title, date: p.date }));

const FAQ_ITEMS = [
  { q: 'कुंडली मिलान क्या है?', a: 'कुंडली मिलान वर और वधू की जन्म कुंडली की तुलना कर वैवाहिक जीवन की अनुकूलता जांचने की वैदिक पद्धति है। इसमें चंद्र राशि व नक्षत्र के आधार पर अष्टकूट गुणों का आकलन होता है।' },
  { q: '36 गुणों का क्या मतलब है?', a: 'अष्टकूट मिलान में कुल 36 गुण होते हैं, जो वर्ण, वश्य, तारा, योनि, ग्रह मैत्री, गण, भकूट और नाड़ी — इन आठ कूटों से मिलकर बनते हैं। जितने अधिक गुण मिलें, वैवाहिक जीवन उतना ही अनुकूल माना जाता है।' },
  { q: 'क्या बिना जन्म समय के कुंडली मिलान हो सकता है?', a: 'सटीक परिणाम के लिए जन्म तारीख, समय और स्थान तीनों आवश्यक हैं। समय अनुपलब्ध होने पर अनुमानित परिणाम दिया जा सकता है, पर सटीकता प्रभावित हो सकती है।' },
  { q: 'मंगल दोष कैसे पता चलता है?', a: 'जन्म कुंडली में मंगल के प्रथम, द्वितीय, चतुर्थ, सप्तम, अष्टम या द्वादश भाव में स्थित होने पर मंगल दोष माना जाता है। हमारी दोष जांच सेवा से यह स्वतः जांचा जा सकता है।' },
  { q: 'कुंडली मिलान की रिपोर्ट कितनी विश्वसनीय है?', a: 'हमारी गणनाएं मानक ज्योतिषीय सूत्रों और लाहिड़ी अयनांश पर आधारित हैं। यह मार्गदर्शन हेतु है; अंतिम निर्णय हेतु किसी अनुभवी ज्योतिषी से परामर्श उचित रहता है।' },
];

function formatDate(d) {
  return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function MiniCalendar({ onNavigate }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const weekLabels = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function shiftMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="card home-calendar-card">
      <div className="home-calendar-header">
        <h3>हिंदू कैलेंडर – {monthName}</h3>
        <div className="home-calendar-nav">
          <button type="button" aria-label="पिछला माह" onClick={() => shiftMonth(-1)}>‹</button>
          <button type="button" aria-label="अगला माह" onClick={() => shiftMonth(1)}>›</button>
        </div>
      </div>
      <div className="mini-cal-grid mini-cal-weekdays">
        {weekLabels.map((w, i) => <span key={i}>{w}</span>)}
      </div>
      <div className="mini-cal-grid">
        {cells.map((d, i) => (
          <span
            key={i}
            className={`mini-cal-cell${d === null ? ' empty' : ''}${isCurrentMonth && d === today.getDate() ? ' today' : ''}`}
          >
            {d || ''}
          </span>
        ))}
      </div>
      <p className="muted small home-calendar-note">आज की तारीख को गोल चिह्न से दर्शाया गया है।</p>
      <button type="button" className="btn-link" onClick={() => onNavigate('calendar')}>विस्तृत हिंदू कैलेंडर देखें →</button>
    </div>
  );
}

export default function Home({ onNavigate }) {
  const [faqOpen, setFaqOpen] = useState(0);

  const today = useMemo(() => new Date(), []);

  const panchang = useMemo(() => {
    try {
      // दिल्ली के देशांतर-अक्षांश पर आधारित डिफ़ॉल्ट पंचांग (IST, UTC+5:30)
      return calculatePanchang(today, 28.6139, 77.209, 5.5);
    } catch (e) {
      return null;
    }
  }, [today]);

  return (
    <div className="home-page">
      {/* ---------- हीरो सेक्शन ---------- */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-content">
            <h1>
              आपके जीवनसाथी की सही शुरुआत,<br />
              <span className="home-hero-highlight">सही कुंडली मिलान</span> से
            </h1>
            <p className="home-hero-sub">
              जन्म कुंडली, गुण मिलान, विवाह मुहूर्त और ज्योतिषीय सेवाएं — एक ही जगह।
            </p>
            <div className="home-hero-actions">
              <button type="button" className="home-btn home-btn-primary" onClick={() => onNavigate('milan')}>
                👤 कुंडली मिलान करें
              </button>
              <button type="button" className="home-btn home-btn-outline" onClick={() => onNavigate('kundli')}>
                ⦿ अपनी कुंडली देखें
              </button>
            </div>
          </div>

          <div className="home-hero-visual" aria-hidden="true">
            <svg className="home-hero-wheel" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="150" r="140" fill="none" stroke="#e0b84a" strokeOpacity="0.55" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="110" fill="none" stroke="#e0b84a" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx="150" cy="150" r="60" fill="none" stroke="#e0b84a" strokeOpacity="0.5" strokeWidth="1" />
              {RASHI_SYMBOLS.map((sym, i) => {
                const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
                const x = 150 + Math.cos(angle) * 125;
                const y = 150 + Math.sin(angle) * 125;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="15" fill="#3d0d16" stroke="#e0b84a" strokeOpacity="0.6" strokeWidth="1" />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="15" fill="#e0b84a">
                      {sym}
                    </text>
                  </g>
                );
              })}
              <text x="150" y="150" textAnchor="middle" dominantBaseline="central" fontSize="34" fill="#e0b84a" fillOpacity="0.9">ॐ</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ---------- पंचांग / शुभ संकेत / कैलेंडर ---------- */}
      <section className="home-section">
        <div className="home-triple-grid">
          <div className="card home-panchang-card">
            <h3>आज का पंचांग</h3>
            <div className="home-panchang-meta">
              <span>{today.toLocaleDateString('hi-IN', { weekday: 'long' })}, {formatDate(today)}</span>
              <span className="home-loc-pill">📍 दिल्ली</span>
            </div>
            {panchang ? (
              <div className="panchang-grid home-panchang-grid">
                <div className="panchang-item"><span className="panchang-label">सूर्योदय</span><span>{panchang.fmtTime(panchang.sunrise)}</span></div>
                <div className="panchang-item"><span className="panchang-label">सूर्यास्त</span><span>{panchang.fmtTime(panchang.sunset)}</span></div>
                <div className="panchang-item"><span className="panchang-label">राहु काल</span><span>{panchang.rahuKaal ? `${panchang.fmtTime(panchang.rahuKaal.start)} – ${panchang.fmtTime(panchang.rahuKaal.end)}` : '—'}</span></div>
                <div className="panchang-item"><span className="panchang-label">नक्षत्र</span><span>{panchang.nakshatra}</span></div>
                <div className="panchang-item"><span className="panchang-label">तिथि</span><span>{panchang.tithi.name}</span></div>
                <div className="panchang-item"><span className="panchang-label">पक्ष</span><span>{panchang.tithi.paksha}</span></div>
              </div>
            ) : (
              <p className="muted small">पंचांग गणना उपलब्ध नहीं है।</p>
            )}
            <button type="button" className="btn-link" onClick={() => onNavigate('panchang')}>पूरा पंचांग देखें →</button>
          </div>

          <div className="card home-sanket-card">
            <h3>आज के शुभ संकेत</h3>
            <div className="sanket-grid">
              <div className="sanket-item"><span className="sanket-icon">⭐</span><span className="sanket-label">आज का नक्षत्र</span><strong>{panchang ? panchang.nakshatra : 'रोहिणी'}</strong></div>
              <div className="sanket-item"><span className="sanket-icon">📅</span><span className="sanket-label">आज की तिथि</span><strong>{panchang ? panchang.tithi.name : 'द्वितीया'}</strong></div>
              <div className="sanket-item"><span className="sanket-icon">☀️</span><span className="sanket-label">आज का शुभ मुहूर्त</span><strong>{panchang?.abhijit ? `${panchang.fmtTime(panchang.abhijit.start)} – ${panchang.fmtTime(panchang.abhijit.end)}` : '10:45 AM – 12:15 PM'}</strong></div>
              <div className="sanket-item"><span className="sanket-icon">☀️</span><span className="sanket-label">अभिजित मुहूर्त</span><strong>{panchang?.abhijit ? `${panchang.fmtTime(panchang.abhijit.start)} – ${panchang.fmtTime(panchang.abhijit.end)}` : '12:01 PM – 12:48 PM'}</strong></div>
              <div className="sanket-item"><span className="sanket-icon">🌙</span><span className="sanket-label">चंद्र राशि</span><strong>वृषभ</strong></div>
            </div>
          </div>

          <MiniCalendar onNavigate={onNavigate} />
        </div>
      </section>

      {/* ---------- हमारी ज्योतिष सेवाएं ---------- */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>हमारी ज्योतिष सेवाएं</h2>
            <p className="muted">आपकी हर ज़रूरत के लिए सम्पूर्ण ज्योतिषीय समाधान</p>
          </div>
          <button type="button" className="home-btn home-btn-primary home-btn-sm" onClick={() => onNavigate('vivah')}>सभी सेवाएं देखें →</button>
        </div>
        <div className="services-grid">
          {SERVICES.map((s) => (
            <button type="button" key={s.title} className="service-card" onClick={() => onNavigate(s.tab)}>
              <span className="service-icon">{s.icon}</span>
              <h4>{s.title}</h4>
              <p className="muted small">{s.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- कुंडली मिलान CTA बैंड ---------- */}
      <section className="home-match-band">
        <div className="home-match-simple">
          <h2>क्या आपकी कुंडली आपके जीवनसाथी से मेल खाती है?</h2>
          <p>वर-वधू की जन्म जानकारी डालें और तुरंत गुण मिलान व अनुकूलता रिपोर्ट पाएं।</p>
          <button type="button" className="home-btn home-btn-primary home-match-cta-btn" onClick={() => onNavigate('milan')}>
            ♥ कुंडली मिलान करें
          </button>
        </div>
      </section>

      {/* ---------- ज्योतिषी से बात करें (WhatsApp) ---------- */}
      <section className="home-astro-band">
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
      </section>


      {/* ---------- आज का राशिफल ---------- */}
      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <h2>आज का राशिफल</h2>
            <p className="muted">12 राशियों का विस्तृत राशिफल</p>
          </div>
          <button type="button" className="home-btn home-btn-outline-light home-btn-sm" onClick={() => onNavigate('rashifal')}>सभी राशिफल देखें →</button>
        </div>
        <div className="rashi-grid">
          {RASHI_NAMES.map((name, i) => (
            <button type="button" key={name} className="rashi-card" onClick={() => onNavigate('rashifal')}>
              <span className="rashi-symbol">{RASHI_SYMBOLS[i]}</span>
              <strong>{name}</strong>
              <span className="rashi-keywords">
                {RASHI_KEYWORDS[i].map((k) => <em key={k}>{k}</em>)}
              </span>
              <span className="rashi-stars" aria-hidden="true">
                {'★'.repeat(RASHI_STARS[i])}{'☆'.repeat(5 - RASHI_STARS[i])}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- शुभ मुहूर्त + विवाह सेवाएं ---------- */}
      <section className="home-section">
        <div className="home-two-col">
          <div className="card">
            <div className="home-card-heading">
              <h3>आज के शुभ मुहूर्त</h3>
              <button type="button" className="btn-link" onClick={() => onNavigate('muhurat')}>सभी मुहूर्त देखें →</button>
            </div>
            <ul className="muhurat-list">
              {MUHURAT_ITEMS.map((m) => (
                <li key={m.label}>
                  <span className="muhurat-icon">{m.icon}</span>
                  <span className="muhurat-label">{m.label}</span>
                  <span className="muhurat-time">{m.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="home-card-heading">
              <h3>विवाह एवं ज्योतिष सेवाएं</h3>
              <button type="button" className="btn-link" onClick={() => onNavigate('vivah')}>सभी सेवाएं देखें →</button>
            </div>
            <div className="vivah-service-grid">
              {VIVAH_SERVICES.map((v) => (
                <button type="button" key={v.title} className="vivah-service-item" title={v.desc} onClick={() => onNavigate(v.tab)}>
                  <span>{v.icon}</span>
                  <p>{v.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ब्लॉग / FAQ / CTA ---------- */}
      <section className="home-section">
        <div className="home-three-col">
          <div>
            <div className="home-card-heading">
              <h3>ज्योतिष ज्ञान</h3>
              <button type="button" className="btn-link" onClick={() => onNavigate('blog')}>सभी लेख पढ़ें →</button>
            </div>
            <p className="muted small">राशि, ग्रह और जीवन से जुड़ी उपयोगी जानकारी</p>
            <div className="blog-list">
              {BLOG_POSTS.map((b) => (
                <button type="button" key={b.title} className="blog-card" onClick={() => onNavigate('blog', b.id)}>
                  <span className="blog-thumb" aria-hidden="true">🕉️</span>
                  <span>
                    <strong>{b.title}</strong>
                    <span className="blog-date">{b.date}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="home-card-heading">
              <h3>अक्सर पूछे जाने वाले प्रश्न</h3>
              <button type="button" className="btn-link" onClick={() => onNavigate('faq')}>सभी सवाल देखें →</button>
            </div>
            <div className="faq-list">
              {FAQ_ITEMS.map((f, i) => (
                <div className={`faq-item${faqOpen === i ? ' open' : ''}`} key={f.q}>
                  <button type="button" className="faq-question" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                    <span>{f.q}</span>
                    <span className="faq-toggle">{faqOpen === i ? '−' : '+'}</span>
                  </button>
                  {faqOpen === i && <p className="faq-answer">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="home-cta-box">
            <h3>अपने रिश्ते की शुरुआत सही जानकारी के साथ करें</h3>
            <p>आज ही अपनी और अपने जीवनसाथी की कुंडली मिलाएं और विस्तृत मिलान रिपोर्ट प्राप्त करें।</p>
            <button type="button" className="home-btn home-btn-gold" onClick={() => onNavigate('milan')}>कुंडली मिलान करें</button>
          </div>
        </div>
      </section>
    </div>
  );
}
