import React from 'react';
import { checkMangalDosha, checkKaalSarpDosha, DOSHA_REMEDIES } from '../utils/doshas.js';

export default function DoshaCard({ chart }) {
  const manglik = checkMangalDosha(chart);
  const kaalSarp = checkKaalSarpDosha(chart);

  return (
    <div className="card">
      <h3>🕉️ दोष विश्लेषण व उपाय (Dosha &amp; Remedies)</h3>

      <div className="insight-section">
        <h4>
          मंगल दोष (Manglik) —{' '}
          <span className={manglik.isManglik ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
            {manglik.isManglik ? 'मौजूद है' : 'नहीं है'}
          </span>
        </h4>
        <p style={{ margin: 0 }}>{manglik.text}</p>
      </div>

      <div className="insight-section">
        <h4>
          काल सर्प दोष —{' '}
          <span className={kaalSarp.isKaalSarp ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
            {kaalSarp.isKaalSarp ? 'योग बनता है' : 'नहीं है'}
          </span>
        </h4>
        <p style={{ margin: 0 }}>{kaalSarp.text}</p>
      </div>

      {(manglik.isManglik || kaalSarp.isKaalSarp) && (
        <div className="insight-section">
          <h4>🪔 सुझाए गए सामान्य उपाय</h4>
          {manglik.isManglik && (
            <>
              <p className="label-tag">मंगल दोष हेतु</p>
              <ul style={{ margin: '4px 0 10px 18px', padding: 0 }}>
                {DOSHA_REMEDIES.manglik.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
              </ul>
            </>
          )}
          {kaalSarp.isKaalSarp && (
            <>
              <p className="label-tag">काल सर्प दोष हेतु</p>
              <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                {DOSHA_REMEDIES.kaalSarp.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
              </ul>
            </>
          )}
        </div>
      )}

      <p className="small muted" style={{ marginTop: 8 }}>
        ⚠️ दोष विश्लेषण परंपरागत नियमों पर आधारित सामान्य संकेत है, अंतिम निष्कर्ष नहीं। विवाह या किसी बड़े
        निर्णय से पूर्व अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर सलाह अवश्य लें। उपाय किसी चिकित्सीय/वित्तीय
        गारंटी का दावा नहीं करते।
      </p>
    </div>
  );
}
