import React, { useState } from 'react';
import BirthForm from './BirthForm.jsx';
import { calculateBirthChart } from '../utils/astro.js';
import { checkMangalDosha, DOSHA_REMEDIES } from '../utils/doshas.js';

export default function MangalDoshaCheck() {
  const [person, setPerson] = useState(null);
  const [manglik, setManglik] = useState(null);

  function handleSubmit(data) {
    const chart = calculateBirthChart(data.utcDate, data.latitude, data.longitude);
    setPerson(data);
    setManglik(checkMangalDosha(chart));
  }

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>🔺 मंगल दोष (Manglik) जांच</h1>
        <p>अपनी जन्म तारीख, समय व स्थान भरें और तुरंत जानें कि आपकी कुंडली में मंगल दोष है या नहीं।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="grid-2">
          <BirthForm title="जन्म विवरण भरें" onSubmit={handleSubmit} />

          <div className="card">
            <h3>मंगल दोष के बारे में</h3>
            <p className="muted small" style={{ margin: 0 }}>
              जब जन्म कुंडली में मंगल ग्रह लग्न, द्वितीय, चतुर्थ, सप्तम, अष्टम या द्वादश भाव में स्थित होता है, तो
              इसे मंगल दोष (मांगलिक योग) कहा जाता है। यह विवाह में विलंब या जीवनसाथी से मतभेद जैसे सामान्य संकेत
              दे सकता है — लेकिन उपयुक्त उपायों या मांगलिक-मांगलिक विवाह से इसका प्रभाव संतुलित माना जाता है।
            </p>
          </div>
        </div>

        {manglik && (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>
              {person?.name ? `${person.name} की ` : ''}मंगल दोष रिपोर्ट —{' '}
              <span className={manglik.isManglik ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
                {manglik.isManglik ? 'मंगल दोष मौजूद है' : 'मंगल दोष नहीं है'}
              </span>
            </h3>
            <div className="highlight-box">{manglik.text}</div>

            <div className="insight-section">
              <h4>भाव विवरण</h4>
              <p style={{ margin: 0 }}>
                लग्न से मंगल <strong>{manglik.houseFromLagna}वें</strong> भाव में तथा चंद्र से{' '}
                <strong>{manglik.houseFromMoon}वें</strong> भाव में स्थित है।
              </p>
            </div>

            {manglik.isManglik && (
              <div className="insight-section">
                <h4>🪔 सुझाए गए सामान्य उपाय</h4>
                <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                  {DOSHA_REMEDIES.manglik.map((r, i) => <li key={i} style={{ marginBottom: 4 }}>{r}</li>)}
                </ul>
              </div>
            )}

            <p className="small muted" style={{ marginTop: 8 }}>
              ⚠️ यह विश्लेषण परंपरागत नियमों पर आधारित सामान्य संकेत है, अंतिम निष्कर्ष नहीं। विवाह से पूर्व
              अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर सलाह अवश्य लें।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
