import React, { useState } from 'react';
import { getCurrentDasha } from '../utils/dasha.js';

function formatDate(d) {
  return d.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DashaTable({ dashaResult }) {
  const [openIndex, setOpenIndex] = useState(null);
  const current = getCurrentDasha(dashaResult);

  return (
    <div className="card">
      <h3>विंशोत्तरी दशा (Vimshottari Dasha)</h3>
      <p className="muted">
        जन्म नक्षत्र: <strong>{dashaResult.nakshatra.name}</strong> (पद {dashaResult.nakshatra.pada}) —
        जन्म के समय चल रही महादशा: <strong>{dashaResult.startingLord}</strong>
      </p>

      {current && (
        <div className="highlight-box">
          <strong>वर्तमान में चल रही दशा:</strong> {current.maha.lord} महादशा
          {current.antar ? ` → ${current.antar.lord} अंतर्दशा` : ''}
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>महादशा (ग्रह)</th>
            <th>आरंभ</th>
            <th>समाप्ति</th>
            <th>अवधि (वर्ष)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dashaResult.mahadashas.map((m, i) => {
            const isCurrent = current && current.maha === m;
            return (
              <React.Fragment key={i}>
                <tr className={isCurrent ? 'row-current' : ''}>
                  <td>{m.lord}{m.isPartial ? ' (जन्मकालीन शेष)' : ''}</td>
                  <td>{formatDate(m.start)}</td>
                  <td>{formatDate(m.end)}</td>
                  <td>{m.years.toFixed(2)}</td>
                  <td>
                    <button className="btn-link" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                      {openIndex === i ? 'अंतर्दशा छुपाएँ' : 'अंतर्दशा देखें'}
                    </button>
                  </td>
                </tr>
                {openIndex === i && (
                  <tr>
                    <td colSpan={5}>
                      <table className="data-table sub-table">
                        <thead>
                          <tr>
                            <th>अंतर्दशा</th>
                            <th>आरंभ</th>
                            <th>समाप्ति</th>
                          </tr>
                        </thead>
                        <tbody>
                          {m.antardashas.map((a, j) => (
                            <tr key={j} className={current && current.antar === a ? 'row-current' : ''}>
                              <td>{a.lord}</td>
                              <td>{formatDate(a.start)}</td>
                              <td>{formatDate(a.end)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
