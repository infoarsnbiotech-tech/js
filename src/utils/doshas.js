import { buildHouses } from './astro.js';

const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];

function houseFromRashi(baseRashiIndex, targetRashiIndex) {
  return ((targetRashiIndex - baseRashiIndex + 12) % 12) + 1;
}

/**
 * मंगल दोष (Manglik Dosha) — लग्न व चंद्र दोनों से जाँच
 */
export function checkMangalDosha(chart) {
  const marsRashiIdx = chart.planets['मंगल'].rashiIndex;
  const houseFromLagna = houseFromRashi(chart.lagna.rashiIndex, marsRashiIdx);
  const houseFromMoon = houseFromRashi(chart.planets['चंद्र'].rashiIndex, marsRashiIdx);

  const fromLagna = MANGLIK_HOUSES.includes(houseFromLagna);
  const fromMoon = MANGLIK_HOUSES.includes(houseFromMoon);
  const isManglik = fromLagna || fromMoon;

  return {
    isManglik,
    houseFromLagna,
    houseFromMoon,
    fromLagna,
    fromMoon,
    text: isManglik
      ? `मंगल ग्रह लग्न से ${houseFromLagna}वें भाव में${fromMoon ? ` तथा चंद्र से ${houseFromMoon}वें भाव में` : ''} स्थित होने के कारण मंगल दोष (मांगलिक योग) बनता है। यह विवाह में विलंब या जीवनसाथी से मतभेद जैसे सामान्य संकेत दे सकता है — मांगलिक-मांगलिक विवाह अथवा उचित उपायों से इसका प्रभाव संतुलित माना जाता है।`
      : 'मंगल ग्रह लग्न व चंद्र दोनों से मांगलिक भावों (1,2,4,7,8,12) में स्थित नहीं है — मंगल दोष नहीं बनता।',
  };
}

/**
 * काल सर्प दोष (Kaal Sarp Dosha) — सभी 7 ग्रह राहु-केतु के एक तरफ हों तो
 */
export function checkKaalSarpDosha(chart) {
  const rahuLon = chart.planets['राहु'].longitude;
  const ketuLon = chart.planets['केतु'].longitude;
  const others = ['सूर्य', 'चंद्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  function isBetween(lon, start, end) {
    const spanLon = ((lon - start) + 360) % 360;
    const spanEnd = ((end - start) + 360) % 360;
    return spanLon <= spanEnd;
  }

  const allOnOneSide = others.every((p) => isBetween(chart.planets[p].longitude, rahuLon, ketuLon))
    || others.every((p) => isBetween(chart.planets[p].longitude, ketuLon, rahuLon));

  return {
    isKaalSarp: allOnOneSide,
    text: allOnOneSide
      ? 'सभी 7 ग्रह राहु-केतु के अक्ष (axis) के एक ही ओर स्थित हैं, जिससे काल सर्प दोष का योग बनता प्रतीत होता है। इसका सटीक प्रकार व तीव्रता जानने हेतु किसी अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर सलाह लें।'
      : 'सभी ग्रह राहु-केतु अक्ष के एक ही ओर नहीं हैं — काल सर्प दोष नहीं बनता।',
  };
}

// सामान्य उपाय — किसी भी गारंटीशुदा परिणाम का दावा नहीं, केवल परंपरागत मार्गदर्शन
export const DOSHA_REMEDIES = {
  manglik: [
    'प्रत्येक मंगलवार हनुमान चालीसा या सुंदरकांड का पाठ करें।',
    'मंगल ग्रह से जुड़ी वस्तुएँ (लाल मसूर, गुड़, तांबा) मंगलवार को दान करें।',
    'विवाह से पूर्व कुंभ विवाह / मांगलिक दोष निवारण पूजा हेतु विद्वान पंडित से परामर्श लें।',
    'शारीरिक श्रम व अनुशासन (व्यायाम, मार्शल आर्ट) से मंगल की ऊर्जा को सकारात्मक दिशा दें।',
  ],
  kaalSarp: [
    'नाग पंचमी के दिन शिवलिंग पर दूध व जल अर्पित करें एवं महामृत्युंजय मंत्र का जाप करें।',
    'राहु-केतु शांति हेतु किसी मान्यता प्राप्त मंदिर (जैसे त्र्यंबकेश्वर) में विधिवत पूजा करवाई जा सकती है।',
    'चांदी का नाग-नागिन जोड़ा बहते जल में विसर्जित करने की परंपरा है।',
  ],
};
