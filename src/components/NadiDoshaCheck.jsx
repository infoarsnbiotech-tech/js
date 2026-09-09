import React, { useState } from 'react';
import BirthForm from './BirthForm.jsx';
import { calculateBirthChart } from '../utils/astro.js';
import { calculateKundliMilan } from '../utils/milan.js';

export default function NadiDoshaCheck() {
  const [brideData, setBrideData] = useState(null);
  const [groomData, setGroomData] = useState(null);
  const [milan, setMilan] = useState(null);

  function computeIfReady(bride, groom) {
    if (bride && groom) {
      const brideChart = calculateBirthChart(bride.utcDate, bride.latitude, bride.longitude);
      const groomChart = calculateBirthChart(groom.utcDate, groom.latitude, groom.longitude);
      setMilan(calculateKundliMilan(brideChart.planets['चंद्र'].longitude, groomChart.planets['चंद्र'].longitude));
    }
  }

  const nadiRow = milan?.results.find((r) => r.koota === 'नाड़ी');

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>🐍 नाड़ी दोष जांच</h1>
        <p>वर व वधू दोनों का जन्म विवरण भरें — नाड़ी कूट (36 गुण मिलान में से 8 अंक) के आधार पर नाड़ी दोष जांचें।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="grid-2">
          <BirthForm
            title="वधू का जन्म विवरण"
            onSubmit={(data) => { setBrideData(data); computeIfReady(data, groomData); }}
          />
          <BirthForm
            title="वर का जन्म विवरण"
            onSubmit={(data) => { setGroomData(data); computeIfReady(brideData, data); }}
          />
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>नाड़ी दोष के बारे में</h3>
          <p className="muted small" style={{ margin: 0 }}>
            अष्टकूट गुण मिलान में नाड़ी कूट सबसे अधिक (8 अंक) भार रखता है। वर व वधू के जन्म-नक्षत्र की नाड़ी
            (आदि, मध्य या अंत्य) एक समान होने पर नाड़ी दोष माना जाता है, जो संतान-सुख व स्वास्थ्य से जुड़ी
            परंपरागत चिंता दर्शाता है। भिन्न नाड़ी होने पर पूरे 8 अंक प्राप्त होते हैं।
          </p>
        </div>

        {milan && nadiRow && (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>
              नाड़ी दोष रिपोर्ट —{' '}
              <span className={milan.nadiDosha ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
                {milan.nadiDosha ? 'नाड़ी दोष मौजूद है' : 'नाड़ी दोष नहीं है'}
              </span>
            </h3>
            <table className="data-table">
              <thead>
                <tr><th>कूट</th><th>प्राप्तांक</th><th>पूर्णांक</th><th>विवरण</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>{nadiRow.koota}</td>
                  <td>{nadiRow.score}</td>
                  <td>{nadiRow.max}</td>
                  <td className="muted small">{nadiRow.detail}</td>
                </tr>
              </tbody>
            </table>

            {milan.nadiDosha ? (
              <div className="warning-box">
                <p>⚠️ वर व वधू दोनों की नाड़ी एक समान है, जिससे नाड़ी दोष बनता है।</p>
                <p>पारंपरिक मान्यता अनुसार भिन्न गण/राशि होने पर, या विशेष पूजा (नाड़ी दोष निवारण पूजा) से इसका प्रभाव संतुलित माना जाता है — विवाह से पूर्व अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर सलाह अवश्य लें।</p>
              </div>
            ) : (
              <div className="highlight-box">वर व वधू की नाड़ी भिन्न है — नाड़ी कूट में पूरे {nadiRow.max} अंक प्राप्त होते हैं, जो शुभ संकेत है।</div>
            )}

            <p className="small muted" style={{ marginTop: 10 }}>
              पूर्ण 36 गुण मिलान रिपोर्ट (सभी 8 कूट) देखने के लिए{' '}
              <strong>कुंडली मिलान</strong> पेज पर जाएँ।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
