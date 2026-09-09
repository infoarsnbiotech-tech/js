import React, { useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Home from './components/Home.jsx';
import HinduCalendar from './components/HinduCalendar.jsx';
import BirthForm from './components/BirthForm.jsx';
import KundliChart from './components/KundliChart.jsx';
import NavamsaChart from './components/NavamsaChart.jsx';
import HousesTable from './components/HousesTable.jsx';
import GrahTable from './components/GrahTable.jsx';
import DashaTable from './components/DashaTable.jsx';
import DashaPrediction from './components/DashaPrediction.jsx';
import PersonalInsights from './components/PersonalInsights.jsx';
import DoshaCard from './components/DoshaCard.jsx';
import PanchangCard from './components/PanchangCard.jsx';
import KundliMilanResult from './components/KundliMilanResult.jsx';
import MangalDoshaCheck from './components/MangalDoshaCheck.jsx';
import NadiDoshaCheck from './components/NadiDoshaCheck.jsx';
import MarriagePrediction from './components/MarriagePrediction.jsx';
import MuhuratPage from './components/MuhuratPage.jsx';
import VivahServices from './components/VivahServices.jsx';
import BlogPage from './components/BlogPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import PalmScan from './components/PalmScan.jsx';
import { calculateBirthChart } from './utils/astro.js';
import { calculateVimshottariDasha } from './utils/dasha.js';
import { calculateKundliMilan } from './utils/milan.js';
import { findFavorableMahadashas, intersectWindows } from './utils/marriageTiming.js';

// नेव में जिन टैब का कोई डेडिकेटेड टूल पेज नहीं है, वे होम पेज पर ही खुलते हैं
const HOME_ALIAS_TABS = new Set(['rashifal', 'panchang', 'faq', 'about', 'privacy', 'terms']);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [blogPostId, setBlogPostId] = useState(null);

  function navigate(tab, extra) {
    const resolved = HOME_ALIAS_TABS.has(tab) ? 'home' : tab;
    if (resolved === 'blog') setBlogPostId(extra || null);
    setActiveTab(resolved);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ----- जन्म कुंडली state -----
  const [person, setPerson] = useState(null);
  const [chart, setChart] = useState(null);
  const [dasha, setDasha] = useState(null);

  function handlePersonSubmit(data) {
    const birthChart = calculateBirthChart(data.utcDate, data.latitude, data.longitude);
    const dashaResult = calculateVimshottariDasha(birthChart.planets['चंद्र'].longitude, data.utcDate);
    setPerson(data);
    setChart(birthChart);
    setDasha(dashaResult);
  }

  // ----- कुंडली मिलान state -----
  const [brideData, setBrideData] = useState(null);
  const [groomData, setGroomData] = useState(null);
  const [milanResult, setMilanResult] = useState(null);
  const [weddingWindows, setWeddingWindows] = useState(null);
  const [milanTouched, setMilanTouched] = useState(false);

  function handleMatchClick() {
    setMilanTouched(true);
    computeMilanIfReady(brideData, groomData);
    if (brideData && groomData) {
      window.scrollTo({ top: document.getElementById('milan-result-area')?.offsetTop || 0, behavior: 'smooth' });
    }
  }

  function computeMilanIfReady(bride, groom) {
    if (bride && groom) {
      const brideChart = calculateBirthChart(bride.utcDate, bride.latitude, bride.longitude);
      const groomChart = calculateBirthChart(groom.utcDate, groom.latitude, groom.longitude);
      const result = calculateKundliMilan(brideChart.planets['चंद्र'].longitude, groomChart.planets['चंद्र'].longitude);
      setMilanResult(result);

      const brideDasha = calculateVimshottariDasha(brideChart.planets['चंद्र'].longitude, bride.utcDate);
      const groomDasha = calculateVimshottariDasha(groomChart.planets['चंद्र'].longitude, groom.utcDate);
      const brideFavorable = findFavorableMahadashas(brideChart, brideDasha);
      const groomFavorable = findFavorableMahadashas(groomChart, groomDasha);
      setWeddingWindows(intersectWindows(brideFavorable, groomFavorable));
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader activeTab={activeTab} onNavigate={navigate} />

      {activeTab === 'home' && <Home onNavigate={navigate} />}

      {activeTab === 'calendar' && <HinduCalendar onNavigate={navigate} />}

      {activeTab === 'kundli' && (
        <div className="app-container">
          <div className="tab-content">
            <BirthForm title="जन्म तारीख, समय और जन्म स्थान भरें" onSubmit={handlePersonSubmit} />
            {chart && (
              <div id="kundli-print-area">
                <div className="kundli-result-header">
                  <h2 className="section-title" style={{ marginBottom: 0 }}>{person.name || 'जातक'} की कुंडली</h2>
                  <button type="button" className="btn-primary pdf-download-btn" onClick={() => window.print()}>
                    📄 PDF डाउनलोड / प्रिंट करें
                  </button>
                </div>
                {/* DEBUG: यह लाइन दिखाती है कि calculation को असल में कौन-सी values मिल रही हैं।
                    अगर अलग-अलग जन्म-विवरण डालने पर भी नीचे की वैल्यू change नहीं होतीं,
                    तो समस्या फॉर्म/लोकेशन-सेलेक्ट में है, calculation में नहीं। टेस्टिंग के बाद यह ब्लॉक हटा दें। */}
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8, wordBreak: 'break-all' }}>
                  DEBUG → date: {person.date}, time: {person.time}, tzOffset: {person.tzOffset},
                  lat: {person.latitude}, lon: {person.longitude}, utcDate(ISO): {person.utcDate?.toISOString()}
                </div>
                <div className="grid-2">
                  <KundliChart chart={chart} chartTitle="जन्म कुंडली (D1)" />
                  <NavamsaChart chart={chart} />
                </div>
                <div className="grid-2">
                  <GrahTable chart={chart} />
                  <HousesTable chart={chart} />
                </div>
                <PanchangCard person={person} />
                <DashaTable dashaResult={dasha} />
                <DashaPrediction dashaResult={dasha} />
                <PersonalInsights chart={chart} onNavigate={navigate} />
                <DoshaCard chart={chart} />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'milan' && (
        <div className="app-container">
          <div className="tab-content">
            <div className="grid-2">
              <BirthForm
                title={`वधू का जन्म विवरण ${brideData ? '✅' : ''}`}
                onSubmit={(data) => {
                  setBrideData(data);
                  setMilanTouched(false);
                  setMilanResult(null);
                  setWeddingWindows(null);
                }}
              />
              <BirthForm
                title={`वर का जन्म विवरण ${groomData ? '✅' : ''}`}
                onSubmit={(data) => {
                  setGroomData(data);
                  setMilanTouched(false);
                  setMilanResult(null);
                  setWeddingWindows(null);
                }}
              />
            </div>

            <div className="milan-match-cta">
              <button
                type="button"
                className="milan-match-btn"
                onClick={handleMatchClick}
              >
                💞 कुंडली मिलान करें
              </button>
              {milanTouched && (!brideData || !groomData) && (
                <p className="milan-match-hint">
                  कृपया पहले वधू व वर — दोनों का जन्म विवरण भरकर "कुंडली बनाएँ" दबाएँ, फिर यहाँ मिलान करें।
                </p>
              )}
            </div>

            <div id="milan-result-area">
              {milanResult && <KundliMilanResult milan={milanResult} weddingWindows={weddingWindows} />}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mangal-dosha' && <MangalDoshaCheck />}

      {activeTab === 'nadi-dosha' && <NadiDoshaCheck />}

      {activeTab === 'marriage-prediction' && <MarriagePrediction onNavigate={navigate} />}

      {activeTab === 'palm-scan' && <PalmScan />}

      {activeTab === 'muhurat' && <MuhuratPage onNavigate={navigate} />}

      {activeTab === 'vivah' && <VivahServices onNavigate={navigate} />}

      {activeTab === 'blog' && <BlogPage onNavigate={navigate} initialPostId={blogPostId} />}

      {activeTab === 'contact' && <ContactPage />}

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
