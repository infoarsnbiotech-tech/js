import React, { useState } from 'react';
import { RASHI_NAMES } from '../utils/astro.js';

// दक्षिण भारतीय शैली — राशियों का स्थान स्थिर रहता है
const SOUTH_GRID_LAYOUT = [
  [11, 0, 1, 2],
  [10, null, null, 3],
  [9, null, null, 4],
  [8, 7, 6, 5],
];

// उत्तर भारतीय शैली — भावों (houses) का स्थान स्थिर रहता है, राशि लग्न अनुसार बदलती है
const NORTH_HOUSE_LABEL_POS = {
  1: [200, 60], 2: [300, 33], 3: [355, 100], 4: [300, 200],
  5: [355, 300], 6: [300, 367], 7: [200, 340], 8: [100, 367],
  9: [45, 300], 10: [100, 200], 11: [45, 100], 12: [100, 33],
};

function SouthIndianGrid({ rashiToPlanets, lagnaRashiIndex, title }) {
  return (
    <>
      <div className="kundli-grid">
        {SOUTH_GRID_LAYOUT.flat().map((rashiIdx, i) => {
          if (rashiIdx === null) {
            if (i === 5) {
              return (
                <div key={i} className="kundli-cell kundli-center" style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                  <span>{title}</span>
                </div>
              );
            }
            return null;
          }
          const isLagna = rashiIdx === lagnaRashiIndex;
          return (
            <div key={i} className={`kundli-cell${isLagna ? ' lagna-cell' : ''}`}>
              <div className="rashi-label">{RASHI_NAMES[rashiIdx]}{isLagna ? ' (ल)' : ''}</div>
              <div className="planet-list">
                {(rashiToPlanets[rashiIdx] || []).map((p) => (
                  <span key={p} className="planet-chip">{p}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="muted small">'ल' चिह्न लग्न (Ascendant) की राशि दर्शाता है</p>
    </>
  );
}

function NorthIndianGrid({ planetsByHouse, lagnaRashiIndex }) {
  return (
    <>
      <svg viewBox="0 0 400 400" className="north-kundli-svg">
        <rect x="1" y="1" width="398" height="398" fill="none" stroke="var(--kundli-line, #a9631c)" strokeWidth="2" />
        <line x1="0" y1="0" x2="400" y2="400" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />
        <line x1="400" y1="0" x2="0" y2="400" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />
        <line x1="200" y1="0" x2="400" y2="200" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />
        <line x1="400" y1="200" x2="200" y2="400" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />
        <line x1="200" y1="400" x2="0" y2="200" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />
        <line x1="0" y1="200" x2="200" y2="0" stroke="var(--kundli-line, #a9631c)" strokeWidth="1.5" />

        {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
          const rashiIdx = (lagnaRashiIndex + houseNum - 1) % 12;
          const [lx, ly] = NORTH_HOUSE_LABEL_POS[houseNum];
          const planets = planetsByHouse[houseNum] || [];
          return (
            <g key={houseNum}>
              <text x={lx} y={ly - 12} textAnchor="middle" className="north-rashi-num" fontSize="13" fontWeight="700">
                {rashiIdx + 1}
              </text>
              {planets.map((p, idx) => (
                <text key={p} x={lx} y={ly + idx * 15} textAnchor="middle" className="north-planet-text" fontSize="13">
                  {p}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <p className="muted small">भाव क्रमांक (Houses) स्थिर हैं; भीतर लिखा अंक उस भाव की राशि क्रमांक (1=मेष...12=मीन) है। भाव-1 लग्न है।</p>
    </>
  );
}

export default function KundliChart({ chart, chartTitle, defaultStyle = 'south' }) {
  const [style, setStyle] = useState(defaultStyle);

  const rashiToPlanets = {};
  for (let i = 0; i < 12; i++) rashiToPlanets[i] = [];
  for (const [name, info] of Object.entries(chart.planets)) {
    rashiToPlanets[info.rashiIndex].push(name + (info.isRetrograde ? ' (व)' : ''));
  }
  const lagnaRashiIndex = chart.lagna.rashiIndex;

  const planetsByHouse = {};
  for (let h = 1; h <= 12; h++) planetsByHouse[h] = [];
  for (const [name, info] of Object.entries(chart.planets)) {
    const houseNum = ((info.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    planetsByHouse[houseNum].push(name + (info.isRetrograde ? '(व)' : ''));
  }

  return (
    <div className="card">
      <div className="kundli-header-row">
        <h3 style={{ margin: 0 }}>{chartTitle || 'जन्म कुंडली'}</h3>
        <div className="chart-style-toggle">
          <button type="button" className={style === 'south' ? 'active' : ''} onClick={() => setStyle('south')}>दक्षिण भारतीय</button>
          <button type="button" className={style === 'north' ? 'active' : ''} onClick={() => setStyle('north')}>उत्तर भारतीय</button>
        </div>
      </div>
      {style === 'south'
        ? <SouthIndianGrid rashiToPlanets={rashiToPlanets} lagnaRashiIndex={lagnaRashiIndex} title={chartTitle || 'वैदिक कुंडली'} />
        : <NorthIndianGrid planetsByHouse={planetsByHouse} lagnaRashiIndex={lagnaRashiIndex} />}
    </div>
  );
}
