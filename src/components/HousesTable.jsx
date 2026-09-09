import React from 'react';
import { buildHouses } from '../utils/astro.js';

const HOUSE_MEANING = [
  'तन/स्वभाव', 'धन/कुटुंब', 'पराक्रम/भाई-बहन', 'सुख/माता', 'संतान/बुद्धि', 'रोग/शत्रु',
  'विवाह/साझेदारी', 'आयु/गुह्य विषय', 'भाग्य/पिता', 'कर्म/व्यवसाय', 'लाभ/आय', 'व्यय/मोक्ष',
];

export default function HousesTable({ chart }) {
  const houses = buildHouses(chart.lagna.rashiIndex, chart.planets);
  return (
    <div className="card">
      <h3>🏠 12 भाव (Houses)</h3>
      <table className="data-table">
        <thead>
          <tr><th>भाव</th><th>अर्थ</th><th>राशि</th><th>ग्रह</th></tr>
        </thead>
        <tbody>
          {houses.map((h, i) => (
            <tr key={h.houseNumber} className={i === 0 ? 'lagna-row' : ''}>
              <td>{h.houseNumber}{i === 0 ? ' (लग्न)' : ''}</td>
              <td>{HOUSE_MEANING[i]}</td>
              <td>{h.rashi}</td>
              <td>{h.planets.length ? h.planets.join(', ') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
