import React from 'react';

function formatDeg(deg) {
  const d = Math.floor(deg);
  const mFull = (deg - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.floor((mFull - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

export default function GrahTable({ chart }) {
  const rows = [
    { name: 'लग्न (Ascendant)', info: chart.lagna },
    ...Object.entries(chart.planets).map(([name, info]) => ({ name, info })),
  ];

  return (
    <div className="card">
      <h3>ग्रह स्थिति (Planetary Positions)</h3>
      <p className="muted">अयनांश (Lahiri Ayanamsa): {formatDeg(chart.ayanamsa)}</p>
      <table className="data-table">
        <thead>
          <tr>
            <th>ग्रह</th>
            <th>राशि</th>
            <th>अंश</th>
            <th>नक्षत्र</th>
            <th>पद</th>
            <th>राशि स्वामी</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, info }) => (
            <tr key={name}>
              <td>
                {name}
                {info.isRetrograde && <span className="retro-tag" title="वक्री (Retrograde)"> (व)</span>}
              </td>
              <td>{info.rashi}</td>
              <td>{formatDeg(info.degreeInRashi)}</td>
              <td>{info.nakshatra}</td>
              <td>{info.pada}</td>
              <td>{info.rashiLord}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">(व) चिह्न वक्री (Retrograde) ग्रह दर्शाता है — राहु-केतु परंपरागत रूप से सदैव वक्री माने जाते हैं।</p>
    </div>
  );
}
