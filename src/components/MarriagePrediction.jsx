import React, { useState } from 'react';
import BirthForm from './BirthForm.jsx';
import { calculateBirthChart } from '../utils/astro.js';
import { calculateVimshottariDasha, getCurrentDasha } from '../utils/dasha.js';
import { checkMangalDosha } from '../utils/doshas.js';
import { marriageInsight, marriageDelayAnalysis } from '../utils/personalInsights.js';
import { findBestMarriageWindows } from '../utils/marriageTiming.js';

function formatDate(d) {
  return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function MarriagePrediction({ onNavigate }) {
  const [person, setPerson] = useState(null);
  const [data, setData] = useState(null);

  function handleSubmit(formData) {
    const chart = calculateBirthChart(formData.utcDate, formData.latitude, formData.longitude);
    const dasha = calculateVimshottariDasha(chart.planets['चंद्र'].longitude, formData.utcDate);
    const insight = marriageInsight(chart);
    const delay = marriageDelayAnalysis(chart);
    const manglik = checkMangalDosha(chart);
    const windows = findBestMarriageWindows(chart, dasha);
    const current = getCurrentDasha(dasha);

    setPerson(formData);
    setData({ dasha, insight, delay, manglik, windows, current });
  }

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>💒 विवाह भविष्यवाणी (Marriage Prediction)</h1>
        <p>जन्म विवरण भरें — विवाह में देरी क्यों हो रही है, इसके कारण-वार उपाय, और कुंडली अनुसार सर्वाधिक शुभ विवाह-अवधि जानें।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <BirthForm title="जन्म तारीख, समय और जन्म स्थान भरें" onSubmit={handleSubmit} />

        {data && (
          <>
            {/* जीवनसाथी का स्वभाव */}
            <div className="card" style={{ marginTop: 20 }}>
              <h3>{person?.name ? `${person.name} के लिए ` : ''}जीवनसाथी व विवाह भाव का विश्लेषण</h3>
              <div className="insight-section">
                <h4>सप्तम भाव (विवाह भाव) — {data.insight.houseRashi} राशि, स्वामी: {data.insight.lord}</h4>
                <p style={{ margin: 0 }}>{data.insight.natureText}</p>
              </div>
              {data.insight.hasOccupants && (
                <div className="insight-section">
                  <h4>सप्तम भाव में स्थित ग्रह</h4>
                  {data.insight.occupantNotes.map((n, i) => <p key={i} style={{ margin: '0 0 6px' }}>{n}</p>)}
                </div>
              )}
            </div>

            {/* विवाह में देरी क्यों — विस्तृत कारण व उपाय */}
            <div className="card" style={{ marginTop: 20 }}>
              <h3>
                ⏳ विवाह में देरी/बाधा — विस्तृत कारण विश्लेषण{' '}
                <span className={data.delay.factors.length > 0 ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
                  {data.delay.delayLevel}
                </span>
              </h3>
              <div className="highlight-box">{data.delay.summary}</div>

              <div className="insight-section">
                <h4>
                  मंगल दोष —{' '}
                  <span className={data.manglik.isManglik ? 'dosha-badge dosha-yes' : 'dosha-badge dosha-no'}>
                    {data.manglik.isManglik ? 'मौजूद है' : 'नहीं है'}
                  </span>
                </h4>
                <p style={{ margin: 0 }}>{data.manglik.text}</p>
              </div>

              {data.delay.factors.map((f, i) => (
                <div className="insight-section" key={i}>
                  <h4>{f.icon} {f.title}</h4>
                  <p style={{ margin: '0 0 6px' }}>{f.text}</p>
                  <p className="label-tag">सुझाया गया उपाय</p>
                  <p style={{ margin: 0 }}>{f.remedy}</p>
                </div>
              ))}

              {data.delay.factors.length === 0 && (
                <p className="muted small" style={{ marginTop: 4 }}>
                  कुंडली में विवाह में देरी से जुड़ा कोई विशेष पारंपरिक संकेत नहीं मिला — यह एक अच्छा संकेत है।
                </p>
              )}
            </div>

            {/* सर्वाधिक शुभ विवाह अवधि */}
            <div className="card" style={{ marginTop: 20 }}>
              <h3>📅 कुंडली अनुसार विवाह हेतु सर्वाधिक शुभ अवधि</h3>
              <p className="muted small">
                नीचे वे अवधियाँ दी गई हैं जब महादशा व अंतर्दशा — दोनों के स्वामी शुक्र, गुरु या सप्तमेश (
                {data.insight.lord}) में से हों। यह विवाह हेतु सबसे अनुकूल (double-favourable) समय माना जाता
                है। यह केवल सामान्य मार्गदर्शन है — सटीक विवाह तिथि व मुहूर्त हेतु गोचर (transit) व पंचांग का
                विश्लेषण भी आवश्यक है।
              </p>
              {data.windows.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>महादशा</th><th>अंतर्दशा</th><th>प्रारंभ</th><th>समाप्ति</th></tr></thead>
                  <tbody>
                    {data.windows.slice(0, 10).map((w, i) => {
                      const isCurrent = data.current && w.start <= new Date() && w.end > new Date();
                      return (
                        <tr key={i} className={isCurrent ? 'row-current' : ''}>
                          <td>{w.mahaLord}</td>
                          <td>{w.antarLord}</td>
                          <td>{formatDate(w.start)}</td>
                          <td>{formatDate(w.end)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="muted small">इस जन्म-चक्र में शुक्र/गुरु/सप्तमेश की संयुक्त अंतर्दशा नहीं मिली — कृपया सामान्य महादशा तालिका (कुंडली टैब में) देखें।</p>
              )}
              {data.current && (
                <div className="highlight-box" style={{ marginTop: 10 }}>
                  वर्तमान में <strong>{data.current.maha.lord}</strong> महादशा / <strong>{data.current.antar?.lord}</strong> अंतर्दशा चल रही है।
                </div>
              )}
            </div>

            <p className="small muted" style={{ marginTop: 12 }}>
              ⚠️ यह संपूर्ण विश्लेषण परंपरागत ज्योतिषीय सिद्धांतों पर आधारित एक सामान्य झलक है, निश्चित
              भविष्यवाणी नहीं। विवाह से जुड़े किसी भी बड़े निर्णय से पूर्व अनुभवी ज्योतिषी से पूर्ण कुंडली
              दिखाकर सलाह अवश्य लें।
            </p>

            {typeof onNavigate === 'function' && (
              <div className="card" style={{ marginTop: 20, textAlign: 'center' }}>
                <h3 style={{ marginTop: 0 }}>अपने होने वाले जीवनसाथी की कुंडली भी मिलाना चाहते हैं?</h3>
                <button type="button" className="btn-primary" onClick={() => onNavigate('milan')}>कुंडली मिलान करें</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
