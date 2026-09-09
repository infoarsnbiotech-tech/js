import React from 'react';
import { getCurrentDasha } from '../utils/dasha.js';
import { getDashaPhal } from '../utils/dashaPredictions.js';

export default function DashaPrediction({ dashaResult }) {
  const current = getCurrentDasha(dashaResult);
  if (!current) return null;

  const mahaPhal = getDashaPhal(current.maha.lord);
  const antarPhal = current.antar ? getDashaPhal(current.antar.lord) : null;

  if (!mahaPhal) return null;

  return (
    <div className="card">
      <h3>वर्तमान दशा फल — धन, स्वास्थ्य, व्यापार व उपाय</h3>
      <p className="muted">
        अभी <strong>{current.maha.lord} महादशा</strong>
        {current.antar ? (
          <>
            {' '}चल रही है, साथ में <strong>{current.antar.lord} अंतर्दशा</strong>
          </>
        ) : (
          ' चल रही है'
        )}
        । नीचे मुख्यतः <strong>{current.maha.lord} महादशा</strong> के सामान्य फल दिए गए हैं।
      </p>

      <div className="highlight-box">
        <strong>स्वभाव:</strong> {mahaPhal.swabhav}
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>💰 धन-लाभ (Wealth)</h4>
          <p style={{ margin: 0 }}>{mahaPhal.dhan}</p>
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>🩺 स्वास्थ्य (Health)</h4>
          <p style={{ margin: 0 }}>{mahaPhal.health}</p>
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>💼 व्यापार / करियर (Business)</h4>
          <p style={{ margin: 0 }}>{mahaPhal.business}</p>
        </div>
      </div>

      {antarPhal && (
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#8a3b12' }}>
            {current.antar.lord} अंतर्दशा का फल भी देखें
          </summary>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="muted small">
              अंतर्दशा महादशा के फल को कम/ज़्यादा या दिशा बदल सकती है — दोनों को साथ में समझें।
            </p>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>💰 धन</h4>
              <p style={{ margin: 0 }}>{antarPhal.dhan}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>🩺 स्वास्थ्य</h4>
              <p style={{ margin: 0 }}>{antarPhal.health}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#8a3b12' }}>💼 व्यापार</h4>
              <p style={{ margin: 0 }}>{antarPhal.business}</p>
            </div>
          </div>
        </details>
      )}

      <div className="warning-box" style={{ marginTop: 16 }}>
        <p style={{ margin: '0 0 6px' }}>
          🙏 <strong>यदि समय खराब चल रहा हो तो उपाय (शांति के लिए):</strong>
        </p>
        <ul style={{ margin: '0 0 6px 18px', padding: 0 }}>
          {mahaPhal.upay.map((u, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{u}</li>
          ))}
        </ul>
        <p className="small" style={{ margin: 0 }}>
          ये उपाय पारंपरिक ज्योतिषीय मान्यताओं पर आधारित हैं और मानसिक संबल व सकारात्मकता बढ़ाने में
          सहायक माने जाते हैं। स्वास्थ्य संबंधी किसी भी गंभीर या लगातार बनी समस्या में डॉक्टर की सलाह
          लेना न छोड़ें — उपाय/दान चिकित्सा का विकल्प नहीं हैं।
        </p>
      </div>
    </div>
  );
}
