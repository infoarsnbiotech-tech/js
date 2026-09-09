import React from 'react';
import { calculatePanchang } from '../utils/panchang.js';

export default function PanchangCard({ person }) {
  const panchang = calculatePanchang(person.utcDate, person.latitude, person.longitude, person.tzOffset);

  return (
    <div className="card">
      <h3>📅 जन्म-दिन का पंचांग (Panchang)</h3>
      <div className="panchang-grid">
        <div className="panchang-item"><span className="panchang-label">वार</span><span>{panchang.vara}</span></div>
        <div className="panchang-item"><span className="panchang-label">तिथि</span><span>{panchang.tithi.paksha} — {panchang.tithi.name}</span></div>
        <div className="panchang-item"><span className="panchang-label">नक्षत्र</span><span>{panchang.nakshatra}</span></div>
        <div className="panchang-item"><span className="panchang-label">योग</span><span>{panchang.yoga}</span></div>
        <div className="panchang-item"><span className="panchang-label">करण</span><span>{panchang.karana}</span></div>
        <div className="panchang-item"><span className="panchang-label">सूर्योदय</span><span>{panchang.fmtTime(panchang.sunrise)}</span></div>
        <div className="panchang-item"><span className="panchang-label">सूर्यास्त</span><span>{panchang.fmtTime(panchang.sunset)}</span></div>
        <div className="panchang-item"><span className="panchang-label">राहु काल</span><span>{panchang.rahuKaal ? `${panchang.fmtTime(panchang.rahuKaal.start)} – ${panchang.fmtTime(panchang.rahuKaal.end)}` : '—'}</span></div>
        <div className="panchang-item"><span className="panchang-label">यमगण्ड</span><span>{panchang.yamaganda ? `${panchang.fmtTime(panchang.yamaganda.start)} – ${panchang.fmtTime(panchang.yamaganda.end)}` : '—'}</span></div>
        <div className="panchang-item"><span className="panchang-label">गुलिक काल</span><span>{panchang.gulikaKaal ? `${panchang.fmtTime(panchang.gulikaKaal.start)} – ${panchang.fmtTime(panchang.gulikaKaal.end)}` : '—'}</span></div>
        <div className="panchang-item"><span className="panchang-label">अभिजित मुहूर्त</span><span>{panchang.abhijit ? `${panchang.fmtTime(panchang.abhijit.start)} – ${panchang.fmtTime(panchang.abhijit.end)}` : '—'}</span></div>
      </div>
      <p className="muted small" style={{ marginTop: 10 }}>
        सूर्योदय/सूर्यास्त व मुहूर्त समय जन्म-स्थान के अक्षांश-देशांतर के आधार पर गणना किए गए हैं (स्थानीय समय-क्षेत्र अनुसार)।
      </p>
    </div>
  );
}
