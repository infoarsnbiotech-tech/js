import React from 'react';
import { KOOTA_INFO } from '../utils/milan.js';

function formatDate(d) {
  return d.toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function KundliMilanResult({ milan, weddingWindows }) {
  const weakKootas = milan.results.filter((r) => r.score < r.max);

  return (
    <div className="card">
      <h3>कुंडली मिलान परिणाम (Ashtakoot Guna Milan)</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>कूट</th>
            <th>प्राप्तांक</th>
            <th>पूर्णांक</th>
            <th>विवरण</th>
          </tr>
        </thead>
        <tbody>
          {milan.results.map((r) => (
            <tr key={r.koota} className={r.score < r.max ? 'row-current' : ''}>
              <td>{r.koota}</td>
              <td>{r.score}</td>
              <td>{r.max}</td>
              <td className="muted small">{r.detail}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td><strong>कुल गुण</strong></td>
            <td><strong>{milan.totalScore.toFixed(1)}</strong></td>
            <td><strong>{milan.totalMax}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="highlight-box">
        <strong>निष्कर्ष:</strong> {milan.verdict} ({milan.totalScore.toFixed(1)} / 36 गुण)
      </div>

      {(milan.nadiDosha || milan.bhakootDosha) && (
        <div className="warning-box">
          {milan.nadiDosha && <p>⚠️ नाड़ी दोष पाया गया है — विवाह से पूर्व विद्वान ज्योतिषी से परामर्श करें।</p>}
          {milan.bhakootDosha && <p>⚠️ भकूट दोष पाया गया है — विवाह से पूर्व विद्वान ज्योतिषी से परामर्श करें।</p>}
        </div>
      )}

      {/* ---------- कमज़ोर कूट — विस्तृत विवरण व उपाय ---------- */}
      {weakKootas.length > 0 && (
        <div className="insight-section">
          <h4>🔍 जिन कूटों में पूरे गुण नहीं मिले — विस्तृत विवरण व उपाय</h4>
          <p className="muted small" style={{ marginBottom: 10 }}>
            नीचे हर उस कूट का विवरण दिया गया है जिसमें पूर्ण अंक नहीं मिले, साथ ही उसका सामान्य अर्थ व
            पारंपरिक उपाय भी बताया गया है।
          </p>
          {weakKootas.map((r) => {
            const info = KOOTA_INFO[r.koota];
            if (!info) return null;
            return (
              <div key={r.koota} className="insight-section" style={{ marginTop: 0 }}>
                <h4>
                  {r.koota} — {r.score}/{r.max} अंक
                </h4>
                <p style={{ margin: '0 0 6px' }}>{info.meaning}</p>
                <p className="label-tag">सुझाया गया उपाय</p>
                <p style={{ margin: 0 }}>{info.remedy}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- शादी हेतु सुझाई गई अनुकूल अवधि ---------- */}
      {weddingWindows && weddingWindows.length > 0 && (
        <div className="insight-section">
          <h4>📅 दोनों की कुंडली अनुसार विवाह हेतु सर्वाधिक अनुकूल अवधि</h4>
          <p className="muted small" style={{ marginBottom: 10 }}>
            नीचे वे समयावधि दी गई हैं, जब वर व वधू दोनों की महादशा शुक्र, गुरु या अपने-अपने सप्तमेश ग्रह की चल
            रही है — इन्हें परंपरागत रूप से विवाह हेतु दोहरी रूप से शुभ (double-favourable) अवधि माना जाता है।
          </p>
          <table className="data-table">
            <thead>
              <tr><th>प्रारंभ</th><th>समाप्ति</th><th>वधू दशा</th><th>वर दशा</th></tr>
            </thead>
            <tbody>
              {weddingWindows.slice(0, 8).map((w, i) => (
                <tr key={i}>
                  <td>{formatDate(w.start)}</td>
                  <td>{formatDate(w.end)}</td>
                  <td>{w.brideLord}</td>
                  <td>{w.groomLord}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small muted" style={{ marginTop: 8 }}>
            ⚠️ यह एक सामान्य दशा-आधारित संकेत है, निश्चित तारीख नहीं। इनमें से किसी अवधि के भीतर सटीक विवाह
            मुहूर्त (तिथि, नक्षत्र व चौघड़िया सहित) निकलवाने हेतु किसी अनुभवी ज्योतिषी/पंडित से परामर्श लें, या
            हमारे <strong>शुभ मुहूर्त</strong> पेज पर आगामी मुहूर्त देखें।
          </p>
        </div>
      )}

      <p className="small muted" style={{ marginTop: 10 }}>
        ⚠️ यह संपूर्ण विश्लेषण पारंपरिक ज्योतिषीय सिद्धांतों पर आधारित सामान्य मार्गदर्शन है, अंतिम निर्णय नहीं।
        विवाह से जुड़े किसी भी बड़े फैसले से पूर्व अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर सलाह अवश्य लें।
      </p>
    </div>
  );
}
