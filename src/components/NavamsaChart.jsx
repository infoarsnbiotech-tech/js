import React from 'react';
import KundliChart from './KundliChart.jsx';
import { calculateNavamsaChart } from '../utils/astro.js';

export default function NavamsaChart({ chart }) {
  const navamsa = calculateNavamsaChart(chart);
  const pseudoChart = {
    planets: navamsa.planets,
    lagna: { rashiIndex: navamsa.lagnaRashiIndex },
  };
  return (
    <div>
      <KundliChart chart={pseudoChart} chartTitle="नवमांश कुंडली (D9)" defaultStyle="south" />
      <p className="muted small" style={{ marginTop: -8, paddingLeft: 4 }}>
        नवमांश (D9) कुंडली विवाह, जीवनसाथी व भाग्य के गहन विश्लेषण हेतु देखी जाती है।
      </p>
    </div>
  );
}
