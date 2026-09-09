import React from 'react';
import {
  buildLuckyProfile,
  educationInsight,
  santaanInsight,
  marriageInsight,
  marriageDelayAnalysis,
  parentsInsight,
  parentsHealthWealthInsight,
  futureGlimpse,
} from '../utils/personalInsights.js';

function LuckyBadge({ label, value, colorHex }) {
  return (
    <div className="lucky-badge">
      <span className="lucky-badge-label">{label}</span>
      <span className="lucky-badge-value">
        {colorHex && <span className="lucky-swatch" style={{ background: colorHex }} />}
        {value}
      </span>
    </div>
  );
}

export default function PersonalInsights({ chart, onNavigate }) {
  const lucky = buildLuckyProfile(chart);
  const edu = educationInsight(chart);
  const santaan = santaanInsight(chart);
  const marriage = marriageInsight(chart);
  const delay = marriageDelayAnalysis(chart);
  const parents = parentsInsight(chart);
  const parentsHW = parentsHealthWealthInsight(chart);
  const glimpse = futureGlimpse(chart);

  return (
    <div className="card">
      <h3>✨ व्यक्तिगत विश्लेषण (शुभ दिन-रंग-अंक, शिक्षा, संतान, विवाह व पारिवारिक जीवन)</h3>
      <p className="muted small">
        यह विश्लेषण जन्मकुंडली के लग्न, चंद्र राशि व भावों (houses) पर आधारित सामान्य पारंपरिक
        मार्गदर्शन है — जीवन की हर स्थिति कई ग्रहों के संयुक्त प्रभाव से बनती है, इसलिए इसे दिशा-सूचक
        समझें, अंतिम सत्य नहीं।
      </p>

      {/* शुभ दिन/रंग/अंक/रत्न */}
      <div className="insight-section">
        <h4>🌟 शुभ दिन, रंग, अंक व रत्न</h4>
        <p className="muted small" style={{ marginBottom: 8 }}>
          लग्न स्वामी ({lucky.lagnaLord}) के अनुसार:
        </p>
        <div className="lucky-badge-row">
          <LuckyBadge label="शुभ दिन" value={lucky.lagna.day} />
          <LuckyBadge label="शुभ रंग" value={lucky.lagna.color} colorHex={lucky.lagna.colorHex} />
          <LuckyBadge label="शुभ अंक" value={lucky.lagna.number} />
          <LuckyBadge label="शुभ रत्न" value={lucky.lagna.gem} />
        </div>
        {lucky.moonLord !== lucky.lagnaLord && (
          <>
            <p className="muted small" style={{ margin: '12px 0 8px' }}>
              चंद्र राशि स्वामी ({lucky.moonLord}) के अनुसार (मानसिक शांति व मन से जुड़े कार्यों हेतु):
            </p>
            <div className="lucky-badge-row">
              <LuckyBadge label="शुभ दिन" value={lucky.moon.day} />
              <LuckyBadge label="शुभ रंग" value={lucky.moon.color} colorHex={lucky.moon.colorHex} />
              <LuckyBadge label="शुभ अंक" value={lucky.moon.number} />
              <LuckyBadge label="शुभ रत्न" value={lucky.moon.gem} />
            </div>
          </>
        )}
        <p className="small muted" style={{ marginTop: 8 }}>
          ⚠️ कोई भी रत्न धारण करने से पहले किसी अनुभवी ज्योतिषी से पूरी कुंडली दिखाकर सलाह अवश्य लें।
        </p>
      </div>

      {/* शिक्षा */}
      <div className="insight-section">
        <h4>📚 शिक्षा (Education)</h4>
        <p style={{ margin: '0 0 6px' }}>
          पंचम भाव (शिक्षा-बुद्धि का भाव) <strong>{edu.houseRashi}</strong> राशि में है, जिसके स्वामी{' '}
          <strong>{edu.lord}</strong> हैं — {edu.fieldText}
        </p>
        {edu.lordPlacementText && (
          <p className="muted small" style={{ margin: '0 0 6px' }}>{edu.lordPlacementText}</p>
        )}
        {edu.occupantNotes.length > 0 && (
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {edu.occupantNotes.map((n, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{n}</li>
            ))}
          </ul>
        )}
      </div>

      {/* संतान */}
      <div className="insight-section">
        <h4>👶 संतान सुख (Children)</h4>
        <p style={{ margin: '0 0 6px' }}>
          पंचम भाव <strong>{santaan.houseRashi}</strong> राशि में, स्वामी <strong>{santaan.lord}</strong> —
          स्थिति: <strong>{santaan.level}</strong>
        </p>
        <p style={{ margin: '0 0 6px' }}>{santaan.text}</p>
        <p className="small muted" style={{ margin: 0 }}>{santaan.note}</p>
      </div>

      {/* जीवनसाथी व विवाह */}
      <div className="insight-section">
        <h4>💑 जीवनसाथी व विवाह (Spouse &amp; Marriage)</h4>
        <p style={{ margin: '0 0 6px' }}>
          सप्तम भाव (विवाह भाव) <strong>{marriage.houseRashi}</strong> राशि में है, जिसके स्वामी{' '}
          <strong>{marriage.lord}</strong> हैं।
        </p>
        <p style={{ margin: '0 0 6px' }}>{marriage.natureText}</p>
        {marriage.lordPlacementText && (
          <p className="muted small" style={{ margin: '0 0 6px' }}>{marriage.lordPlacementText}</p>
        )}
        {marriage.occupantNotes.length > 0 && (
          <ul style={{ margin: '6px 0 10px 18px', padding: 0 }}>
            {marriage.occupantNotes.map((n, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{n}</li>
            ))}
          </ul>
        )}

        <p className="label-tag" style={{ marginTop: 8 }}>
          विवाह में विलंब/बाधा जांच — स्थिति: <strong>{delay.delayLevel}</strong>
        </p>
        <p style={{ margin: '0 0 6px' }}>{delay.summary}</p>
        {delay.factors.length > 0 && (
          <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
            {delay.factors.map((f, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <strong>{f.icon} {f.title}:</strong> {f.text}{' '}
                <span className="muted small">उपाय — {f.remedy}</span>
              </li>
            ))}
          </ul>
        )}

        {typeof onNavigate === 'function' && (
          <button type="button" className="btn-link" style={{ marginTop: 8 }} onClick={() => onNavigate('marriage-prediction')}>
            विवाह हेतु अनुकूल समयावधि (दशा अनुसार) व पूर्ण रिपोर्ट देखें →
          </button>
        )}
      </div>

      {/* माता-पिता */}
      <div className="insight-section">
        <h4>👨‍👩‍👧 माता-पिता से संबंध</h4>
        <p style={{ margin: '0 0 6px' }}>
          <strong>माता (चतुर्थ भाव — {parents.mother.houseRashi}, स्वामी {parents.mother.lord}):</strong>{' '}
          {parents.mother.text}
        </p>
        <p style={{ margin: 0 }}>
          <strong>पिता (नवम भाव — {parents.father.houseRashi}, स्वामी {parents.father.lord}):</strong>{' '}
          {parents.father.text}
        </p>
      </div>

      {/* माता-पिता — स्वास्थ्य व धन-लाभ (विस्तृत) */}
      <div className="insight-section parent-wealth-section">
        <h4>🙏 माता-पिता — स्वास्थ्य व धन-लाभ हेतु विस्तृत मार्गदर्शन</h4>

        <div className="parent-col-grid">
          <div className="parent-col">
            <h5>👵 माता (चतुर्थ भाव — {parentsHW.mother.houseRashi}, स्वामी {parentsHW.mother.lord})</h5>
            <p className="label-tag">स्वास्थ्य</p>
            <p style={{ margin: '0 0 8px' }}>{parentsHW.mother.healthText}</p>
            <p className="label-tag">धन-लाभ हेतु उपाय</p>
            <p style={{ margin: 0 }}>{parentsHW.mother.wealthRemedy}</p>
          </div>
          <div className="parent-col">
            <h5>👴 पिता (नवम भाव — {parentsHW.father.houseRashi}, स्वामी {parentsHW.father.lord})</h5>
            <p className="label-tag">स्वास्थ्य</p>
            <p style={{ margin: '0 0 8px' }}>{parentsHW.father.healthText}</p>
            <p className="label-tag">धन-लाभ हेतु उपाय</p>
            <p style={{ margin: 0 }}>{parentsHW.father.wealthRemedy}</p>
          </div>
        </div>

        <div className="highlight-box" style={{ marginTop: 12 }}>
          <strong>💰 पारिवारिक धन-स्थिति ({parentsHW.familyWealth.level}):</strong>{' '}
          {parentsHW.familyWealth.text}
        </div>

        <p className="label-tag" style={{ marginTop: 12 }}>सामान्य पारिवारिक उपाय</p>
        <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
          {parentsHW.generalRemedies.map((r, i) => (
            <li key={i} style={{ marginBottom: 4 }}>{r}</li>
          ))}
        </ul>

        <p className="small muted" style={{ marginTop: 10 }}>⚠️ {parentsHW.disclaimer}</p>
      </div>

      {/* भविष्य की झलक */}
      <div className="highlight-box">
        <strong>🔮 भविष्य की झलक:</strong> {glimpse}
      </div>
    </div>
  );
}
