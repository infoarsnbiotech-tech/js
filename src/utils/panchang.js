import * as Astronomy from 'astronomy-engine';
import { lahiriAyanamsa, getNakshatraInfo } from './astro.js';

const VARA_NAMES = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const TITHI_BASE = [
  'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी',
  'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी',
];

const YOGA_NAMES = [
  'विष्कुम्भ', 'प्रीति', 'आयुष्मान', 'सौभाग्य', 'शोभन', 'अतिगण्ड', 'सुकर्मा',
  'धृति', 'शूल', 'गण्ड', 'वृद्धि', 'ध्रुव', 'व्याघात', 'हर्षण', 'वज्र',
  'सिद्धि', 'व्यतीपात', 'वरीयान', 'परिघ', 'शिव', 'सिद्ध', 'साध्य', 'शुभ',
  'शुक्ल', 'ब्रह्म', 'ऐन्द्र', 'वैधृति',
];

const KARANA_MOVABLE = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि (भद्रा)'];
const KARANA_FIXED_START = 'किंस्तुघ्न';
const KARANA_FIXED_END = ['शकुनि', 'चतुष्पाद', 'नाग'];

// रविवार से शनिवार तक — दिन के 8वें हिस्सों में से कौन-सा भाग राहु काल है (1-8)
const RAHU_KAAL_PART = { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 };
const YAMAGANDA_PART = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 7, 6: 6 };
const GULIKA_PART = { 0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 1 };

function normalizeDeg(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function tropicalLon(bodyName, date) {
  const geoVector = Astronomy.GeoVector(bodyName, date, true);
  return normalizeDeg(Astronomy.Ecliptic(geoVector).elon);
}

function fmtTime(date, tzOffsetHours) {
  if (!date) return '—';
  const local = new Date(date.getTime() + tzOffsetHours * 60 * 60 * 1000);
  const h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

function getTithiInfo(sunSidereal, moonSidereal) {
  const diff = normalizeDeg(moonSidereal - sunSidereal);
  const tithiIndex = Math.floor(diff / 12); // 0-29
  const paksha = tithiIndex < 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const dayInPaksha = tithiIndex % 15;
  const name = dayInPaksha === 14
    ? (paksha === 'शुक्ल पक्ष' ? 'पूर्णिमा' : 'अमावस्या')
    : TITHI_BASE[dayInPaksha];
  return { name, paksha, index: tithiIndex, degree: diff };
}

function getYogaInfo(sunSidereal, moonSidereal) {
  const sum = normalizeDeg(sunSidereal + moonSidereal);
  const idx = Math.floor(sum / (360 / 27));
  return YOGA_NAMES[idx];
}

function getKaranaInfo(diffDeg) {
  const karanaIdx = Math.floor(diffDeg / 6); // 0-59
  if (karanaIdx === 0) return KARANA_FIXED_START;
  if (karanaIdx >= 57) return KARANA_FIXED_END[karanaIdx - 57];
  return KARANA_MOVABLE[(karanaIdx - 1) % 7];
}

/**
 * किसी तारीख व स्थान के लिए पंचांग निकालना
 */
export function calculatePanchang(utcDate, latitude, longitude, tzOffsetHours) {
  const ayanamsa = lahiriAyanamsa(utcDate);
  const sunSidereal = normalizeDeg(tropicalLon('Sun', utcDate) - ayanamsa);
  const moonSidereal = normalizeDeg(tropicalLon('Moon', utcDate) - ayanamsa);

  const tithi = getTithiInfo(sunSidereal, moonSidereal);
  const yoga = getYogaInfo(sunSidereal, moonSidereal);
  const karana = getKaranaInfo(tithi.degree);
  const moonNak = getNakshatraInfo(moonSidereal);

  const weekday = new Date(utcDate.getTime() + tzOffsetHours * 60 * 60 * 1000).getUTCDay();
  const vara = VARA_NAMES[weekday];

  let sunrise = null;
  let sunset = null;
  try {
    const observer = new Astronomy.Observer(latitude, longitude, 0);
    const searchStart = new Date(utcDate.getTime() - 12 * 60 * 60 * 1000);
    sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, searchStart, 2)?.date || null;
    sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, searchStart, 2)?.date || null;
  } catch (e) {
    // गणना विफल होने पर sunrise/sunset खाली रहेगा
  }

  let rahuKaal = null, yamaganda = null, gulikaKaal = null, abhijit = null;
  if (sunrise && sunset) {
    const dayLenMs = sunset.getTime() - sunrise.getTime();
    const partMs = dayLenMs / 8;
    const partWindow = (partNum) => {
      const start = new Date(sunrise.getTime() + (partNum - 1) * partMs);
      const end = new Date(start.getTime() + partMs);
      return { start, end };
    };
    rahuKaal = partWindow(RAHU_KAAL_PART[weekday]);
    yamaganda = partWindow(YAMAGANDA_PART[weekday]);
    gulikaKaal = partWindow(GULIKA_PART[weekday]);

    const noon = new Date(sunrise.getTime() + dayLenMs / 2);
    abhijit = { start: new Date(noon.getTime() - 24 * 60 * 1000), end: new Date(noon.getTime() + 24 * 60 * 1000) };
  }

  return {
    vara,
    tithi,
    yoga,
    karana,
    nakshatra: moonNak.name,
    sunrise, sunset, rahuKaal, yamaganda, gulikaKaal, abhijit,
    tzOffsetHours,
    fmtTime: (d) => fmtTime(d, tzOffsetHours),
  };
}
