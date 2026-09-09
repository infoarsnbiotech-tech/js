import * as Astronomy from 'astronomy-engine';

// ===================== आधारभूत डेटा (Base Data) =====================

export const RASHI_NAMES = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन',
];

export const RASHI_LORDS = [
  'मंगल', 'शुक्र', 'बुध', 'चंद्र', 'सूर्य', 'बुध',
  'शुक्र', 'मंगल', 'गुरु', 'शनि', 'शनि', 'गुरु',
];

export const NAKSHATRA_NAMES = [
  'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा',
  'पुनर्वसु', 'पुष्य', 'आश्लेषा', 'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी',
  'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
  'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा',
  'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती',
];

// हर नक्षत्र का स्वामी (विंशोत्तरी दशा क्रम अनुसार, 9 ग्रह चक्र में दोहराया जाता है)
export const DASHA_SEQUENCE = ['केतु', 'शुक्र', 'सूर्य', 'चंद्र', 'मंगल', 'राहु', 'गुरु', 'शनि', 'बुध'];
export const DASHA_YEARS = { केतु: 7, शुक्र: 20, सूर्य: 6, चंद्र: 10, मंगल: 7, राहु: 18, गुरु: 16, शनि: 19, बुध: 17 };
// कुल चक्र = 120 वर्ष

export const PLANET_HINDI = {
  Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

// ===================== सहायक फंक्शन (Helpers) =====================

function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// JS Date से Julian Day निकालना (मानक व सत्यापित सूत्र, किसी बाहरी लाइब्रेरी की आवश्यकता नहीं)
function julianDay(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function julianCenturiesFromJ2000(date) {
  const jd = julianDay(date);
  return (jd - 2451545.0) / 36525.0;
}

// ग्रीनविच सायडेरियल टाइम (डिग्री में) - Meeus सूत्र (Ch. 11, फॉर्मूला 11.4)
function greenwichSiderealTimeDeg(date) {
  const jd = julianDay(date);
  const T = (jd - 2451545.0) / 36525.0;
  const gst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return normalizeDeg(gst);
}

// Lahiri (Chitrapaksha) Ayanamsa - मानक सन्निकट सूत्र (approximation formula)
// संदर्भ: N.C. Lahiri पद्धति पर आधारित polynomial approximation
export function lahiriAyanamsa(date) {
  const T = julianCenturiesFromJ2000(date);
  // वर्ष 2000 पर Lahiri ayanamsa ~ 23.85675 डिग्री, प्रति वर्ष ~50.29 आर्कसेकंड की वृद्धि (precession)
  const years = T * 100; // T is in centuries, convert to years since 2000
  const ayanamsaAt2000 = 23.85675;
  const precessionPerYear = 50.2719 / 3600; // arcsec -> degree
  return ayanamsaAt2000 + years * precessionPerYear;
}

// चंद्रमा का माध्य राहु (Mean Lunar Node) - Meeus सूत्र
export function meanRahuLongitude(date) {
  const T = julianCenturiesFromJ2000(date);
  const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  return normalizeDeg(omega);
}

// किसी ग्रह का Tropical (सायन) भूकेन्द्रिक ग्रांतिवृत्तीय देशांतर
// नोट: Astronomy.EclipticLongitude() *सूर्यकेन्द्रिक (heliocentric)* देशांतर देता है और
// Sun के लिए एरर फेंकता है — ज्योतिष के लिए हमेशा *भूकेन्द्रिक (geocentric)* देशांतर चाहिए,
// इसलिए यहाँ Astronomy.GeoVector() + Astronomy.Ecliptic() का उपयोग किया गया है।
function tropicalLongitude(bodyName, date) {
  const geoVector = Astronomy.GeoVector(bodyName, date, true);
  return normalizeDeg(Astronomy.Ecliptic(geoVector).elon);
}

// राशि निकालना (0-11)
export function getRashiIndex(siderealLon) {
  return Math.floor(normalizeDeg(siderealLon) / 30);
}

// नक्षत्र और पद निकालना
export function getNakshatraInfo(siderealLon) {
  const lon = normalizeDeg(siderealLon);
  const nakshatraSpan = 360 / 27; // 13°20'
  const padaSpan = nakshatraSpan / 4; // 3°20'
  const nakIndex = Math.floor(lon / nakshatraSpan);
  const pada = Math.floor((lon % nakshatraSpan) / padaSpan) + 1;
  return {
    index: nakIndex,
    name: NAKSHATRA_NAMES[nakIndex],
    pada,
    degreeInNakshatra: lon % nakshatraSpan,
  };
}

// नवमांश (D9) राशि निकालना — मानक सरलीकृत सूत्र
export function getNavamsaRashiIndex(siderealLon) {
  const lon = normalizeDeg(siderealLon);
  const signIndex = Math.floor(lon / 30);
  const degInSign = lon % 30;
  const navamsaSegment = Math.floor(degInSign / (30 / 9));
  return (signIndex * 9 + navamsaSegment) % 12;
}

// किसी ग्रह की वक्री (Retrograde) स्थिति — एक दिन आगे के देशांतर से तुलना करके
function isRetrogradeBody(bodyName, date) {
  const ayanamsaNow = lahiriAyanamsa(date);
  const lonNow = normalizeDeg(tropicalLongitude(bodyName, date) - ayanamsaNow);
  const dateLater = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const ayanamsaLater = lahiriAyanamsa(dateLater);
  const lonLater = normalizeDeg(tropicalLongitude(bodyName, dateLater) - ayanamsaLater);
  let diff = lonLater - lonNow;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

// ===================== जन्म कुंडली गणना (Main Birth Chart Calculation) =====================

/**
 * जन्म विवरण से पूरी कुंडली निकालना
 * @param {Date} utcDate - जन्म का UTC Date object
 * @param {number} latitude
 * @param {number} longitude
 */
export function calculateBirthChart(utcDate, latitude, longitude) {
  const ayanamsa = lahiriAyanamsa(utcDate);

  const bodies = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const planets = {};

  for (const body of bodies) {
    const tropical = tropicalLongitude(body, utcDate);
    const sidereal = normalizeDeg(tropical - ayanamsa);
    planets[PLANET_HINDI[body]] = buildPlanetInfo(sidereal);
    planets[PLANET_HINDI[body]].isRetrograde = isRetrogradeBody(body, utcDate);
  }

  // चंद्रमा (चंद्रमा कभी वक्री नहीं होता)
  const moonTropical = tropicalLongitude('Moon', utcDate);
  const moonSidereal = normalizeDeg(moonTropical - ayanamsa);
  planets['चंद्र'] = buildPlanetInfo(moonSidereal);
  planets['चंद्र'].isRetrograde = false;

  // राहु-केतु (Mean Node पद्धति — परंपरागत रूप से सदैव वक्री माने जाते हैं)
  const rahuTropical = meanRahuLongitude(utcDate);
  const rahuSidereal = normalizeDeg(rahuTropical - ayanamsa);
  const ketuSidereal = normalizeDeg(rahuSidereal + 180);
  planets['राहु'] = buildPlanetInfo(rahuSidereal);
  planets['राहु'].isRetrograde = true;
  planets['केतु'] = buildPlanetInfo(ketuSidereal);
  planets['केतु'].isRetrograde = true;

  // लग्न (Ascendant)
  const lagnaSidereal = calculateAscendant(utcDate, latitude, longitude, ayanamsa);
  const lagna = buildPlanetInfo(lagnaSidereal);

  return { ayanamsa, planets, lagna };
}

function buildPlanetInfo(siderealLon) {
  const rashiIdx = getRashiIndex(siderealLon);
  const nak = getNakshatraInfo(siderealLon);
  return {
    longitude: siderealLon,
    degreeInRashi: siderealLon % 30,
    rashi: RASHI_NAMES[rashiIdx],
    rashiIndex: rashiIdx,
    rashiLord: RASHI_LORDS[rashiIdx],
    nakshatra: nak.name,
    nakshatraIndex: nak.index,
    pada: nak.pada,
  };
}

// लग्न (Ascendant) गणना - Meeus सूत्र अनुसार
function calculateAscendant(utcDate, latitude, longitudeGeo, ayanamsa) {
  // ग्रीनविच सायडेरियल टाइम (डिग्री में)
  const gstDeg = greenwichSiderealTimeDeg(utcDate);
  // स्थानीय सायडेरियल टाइम (Local Sidereal Time) डिग्री में
  let lstDeg = normalizeDeg(gstDeg + longitudeGeo);

  const lstRad = (lstDeg * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  // पृथ्वी की धुरी का झुकाव (Obliquity of Ecliptic) - सन्निकट मान
  const T = julianCenturiesFromJ2000(utcDate);
  const obliquityDeg = 23.4392911 - 0.0130042 * T;
  const oblRad = (obliquityDeg * Math.PI) / 180;

  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  let ascTropical = (Math.atan2(y, x) * 180) / Math.PI;
  ascTropical = normalizeDeg(ascTropical);

  return normalizeDeg(ascTropical - ayanamsa);
}

// नवमांश (D9) कुंडली — पूरी कुंडली के ग्रहों व लग्न से नवमांश राशि निकालना
export function calculateNavamsaChart(chart) {
  const planets = {};
  for (const [name, info] of Object.entries(chart.planets)) {
    planets[name] = { rashiIndex: getNavamsaRashiIndex(info.longitude) };
  }
  const lagnaRashiIndex = getNavamsaRashiIndex(chart.lagna.longitude);
  return { planets, lagnaRashiIndex };
}

// राशि क्रम अनुसार 12 भाव (Whole Sign House System - सरल व लोकप्रिय पद्धति)
export function buildHouses(lagnaRashiIndex, planets) {
  const houses = Array.from({ length: 12 }, (_, i) => ({
    houseNumber: i + 1,
    rashiIndex: (lagnaRashiIndex + i) % 12,
    rashi: RASHI_NAMES[(lagnaRashiIndex + i) % 12],
    planets: [],
  }));

  for (const [name, info] of Object.entries(planets)) {
    const houseNum = ((info.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    houses[houseNum - 1].planets.push(name);
  }
  return houses;
}
