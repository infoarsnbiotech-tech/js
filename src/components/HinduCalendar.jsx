import React, { useMemo, useState } from 'react';
import { calculatePanchang } from '../utils/panchang.js';

// दिल्ली — डिफ़ॉल्ट स्थान (अक्षांश, देशांतर, समय-क्षेत्र)
const DEFAULT_LAT = 28.6139;
const DEFAULT_LON = 77.209;
const DEFAULT_TZ = 5.5;

const WEEKDAY_LABELS = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

const EVENT_STYLES = {
  ekadashi: { label: 'एकादशी', color: '#c9a227' },
  purnima: { label: 'पूर्णिमा', color: '#2f7dd1' },
  amavasya: { label: 'अमावस्या', color: '#3a3a3a' },
  pradosh: { label: 'प्रदोष', color: '#e07a2f' },
  sankashti: { label: 'संकष्टी चतुर्थी', color: '#3aa662' },
};

function detectEvents(tithiName, dayInPaksha, paksha) {
  const events = [];
  if (tithiName === 'एकादशी') events.push('ekadashi');
  if (tithiName === 'पूर्णिमा') events.push('purnima');
  if (tithiName === 'अमावस्या') events.push('amavasya');
  if (tithiName === 'त्रयोदशी') events.push('pradosh');
  if (tithiName === 'चतुर्थी' && paksha === 'कृष्ण पक्ष') events.push('sankashti');
  return events;
}

function buildMonthData(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    // उस दिन के दोपहर 12 बजे (स्थानीय समय) के लिए UTC समय निकालना — स्थिर गणना हेतु
    const utcMillis = Date.UTC(year, month, d, 12, 0, 0) - DEFAULT_TZ * 60 * 60 * 1000;
    const utcDate = new Date(utcMillis);
    let panchang = null;
    try {
      panchang = calculatePanchang(utcDate, DEFAULT_LAT, DEFAULT_LON, DEFAULT_TZ);
    } catch (e) {
      panchang = null;
    }
    const dayInPaksha = panchang ? panchang.tithi.index % 15 : null;
    const events = panchang ? detectEvents(panchang.tithi.name, dayInPaksha, panchang.tithi.paksha) : [];
    days.push({ date: d, panchang, events });
  }
  return days;
}

export default function HinduCalendar({ onNavigate }) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(
    today.getMonth() === new Date().getMonth() ? today.getDate() : 1
  );

  const monthData = useMemo(() => buildMonthData(viewYear, viewMonth), [viewYear, viewMonth]);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' });
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const selected = monthData.find((d) => d.date === selectedDay) || monthData[0];

  const upcomingEvents = monthData.filter((d) => d.events.length > 0);

  function shiftMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(1);
  }

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  monthData.forEach((d) => cells.push(d));

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>हिंदू पंचांग कैलेंडर</h1>
        <p>तिथि, नक्षत्र, योग, करण और व्रत-त्योहारों की विस्तृत जानकारी — दिल्ली मानक समय (IST) पर आधारित</p>
      </section>

      <div className="hc-body">
        <div className="card hc-calendar-card">
          <div className="hc-calendar-toolbar">
            <button type="button" className="hc-nav-btn" onClick={() => shiftMonth(-1)}>‹ पिछला माह</button>
            <h2>{monthLabel}</h2>
            <button type="button" className="hc-nav-btn" onClick={() => shiftMonth(1)}>अगला माह ›</button>
          </div>

          <div className="hc-legend">
            {Object.entries(EVENT_STYLES).map(([key, val]) => (
              <span key={key} className="hc-legend-item">
                <span className="hc-dot" style={{ background: val.color }} />
                {val.label}
              </span>
            ))}
          </div>

          <div className="hc-grid hc-grid-head">
            {WEEKDAY_LABELS.map((w) => <span key={w}>{w}</span>)}
          </div>
          <div className="hc-grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} className="hc-cell hc-cell-empty" />;
              const isToday = isCurrentMonth && d.date === today.getDate();
              const isSelected = d.date === selectedDay;
              return (
                <button
                  type="button"
                  key={d.date}
                  className={`hc-cell${isToday ? ' hc-today' : ''}${isSelected ? ' hc-selected' : ''}`}
                  onClick={() => setSelectedDay(d.date)}
                >
                  <span className="hc-cell-num">{d.date}</span>
                  {d.panchang && <span className="hc-cell-tithi">{d.panchang.tithi.name}</span>}
                  {d.events.length > 0 && (
                    <span className="hc-cell-dots">
                      {d.events.map((ev) => (
                        <span key={ev} className="hc-dot" style={{ background: EVENT_STYLES[ev].color }} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hc-side">
          {selected && selected.panchang && (
            <div className="card hc-detail-card">
              <h3>{selected.date} {monthLabel} — {selected.panchang.vara}</h3>
              {selected.events.length > 0 && (
                <div className="hc-detail-tags">
                  {selected.events.map((ev) => (
                    <span key={ev} className="hc-tag" style={{ background: EVENT_STYLES[ev].color }}>
                      {EVENT_STYLES[ev].label}
                    </span>
                  ))}
                </div>
              )}
              <div className="panchang-grid hc-detail-grid">
                <div className="panchang-item"><span className="panchang-label">तिथि</span><span>{selected.panchang.tithi.name}</span></div>
                <div className="panchang-item"><span className="panchang-label">पक्ष</span><span>{selected.panchang.tithi.paksha}</span></div>
                <div className="panchang-item"><span className="panchang-label">नक्षत्र</span><span>{selected.panchang.nakshatra}</span></div>
                <div className="panchang-item"><span className="panchang-label">योग</span><span>{selected.panchang.yoga}</span></div>
                <div className="panchang-item"><span className="panchang-label">करण</span><span>{selected.panchang.karana}</span></div>
                <div className="panchang-item"><span className="panchang-label">वार</span><span>{selected.panchang.vara}</span></div>
                <div className="panchang-item"><span className="panchang-label">सूर्योदय</span><span>{selected.panchang.fmtTime(selected.panchang.sunrise)}</span></div>
                <div className="panchang-item"><span className="panchang-label">सूर्यास्त</span><span>{selected.panchang.fmtTime(selected.panchang.sunset)}</span></div>
                <div className="panchang-item">
                  <span className="panchang-label">राहु काल</span>
                  <span>{selected.panchang.rahuKaal ? `${selected.panchang.fmtTime(selected.panchang.rahuKaal.start)} – ${selected.panchang.fmtTime(selected.panchang.rahuKaal.end)}` : '—'}</span>
                </div>
                <div className="panchang-item">
                  <span className="panchang-label">यमगण्ड</span>
                  <span>{selected.panchang.yamaganda ? `${selected.panchang.fmtTime(selected.panchang.yamaganda.start)} – ${selected.panchang.fmtTime(selected.panchang.yamaganda.end)}` : '—'}</span>
                </div>
                <div className="panchang-item">
                  <span className="panchang-label">गुलिक काल</span>
                  <span>{selected.panchang.gulikaKaal ? `${selected.panchang.fmtTime(selected.panchang.gulikaKaal.start)} – ${selected.panchang.fmtTime(selected.panchang.gulikaKaal.end)}` : '—'}</span>
                </div>
                <div className="panchang-item">
                  <span className="panchang-label">अभिजित मुहूर्त</span>
                  <span>{selected.panchang.abhijit ? `${selected.panchang.fmtTime(selected.panchang.abhijit.start)} – ${selected.panchang.fmtTime(selected.panchang.abhijit.end)}` : '—'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="card hc-upcoming-card">
            <h3>इस माह के व्रत व त्योहार</h3>
            {upcomingEvents.length === 0 && <p className="muted small">इस माह कोई विशेष तिथि चिह्नित नहीं है।</p>}
            <ul className="hc-upcoming-list">
              {upcomingEvents.map((d) => (
                <li key={d.date}>
                  <button type="button" onClick={() => setSelectedDay(d.date)}>
                    <span className="hc-upcoming-date">{d.date} {monthLabel.split(' ')[0]}</span>
                    <span className="hc-upcoming-tags">
                      {d.events.map((ev) => (
                        <span key={ev} className="hc-tag hc-tag-sm" style={{ background: EVENT_STYLES[ev].color }}>
                          {EVENT_STYLES[ev].label}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card hc-cta-card">
            <h3>विस्तृत जन्म कुंडली या मिलान चाहिए?</h3>
            <p className="muted small">अपनी जन्म तारीख, समय और स्थान डालकर पूरी कुंडली व दशा प्राप्त करें।</p>
            <button type="button" className="btn-primary" onClick={() => onNavigate('kundli')}>अपनी कुंडली देखें</button>
          </div>
        </div>
      </div>
    </div>
  );
}
