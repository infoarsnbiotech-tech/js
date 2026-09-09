import { DASHA_SEQUENCE, DASHA_YEARS, getNakshatraInfo } from './astro.js';

const NAKSHATRA_SPAN = 360 / 27; // 13°20'
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

function addYears(date, years) {
  return new Date(date.getTime() + years * YEAR_MS);
}

function sequenceStartingAt(lord) {
  const idx = DASHA_SEQUENCE.indexOf(lord);
  return [...DASHA_SEQUENCE.slice(idx), ...DASHA_SEQUENCE.slice(0, idx)];
}

// किसी महादशा के अंदर की अंतर्दशाएँ (Antardasha) निकालना
function buildAntardashas(mahaLord, mahaStart, mahaYears) {
  const seq = sequenceStartingAt(mahaLord);
  let cursor = mahaStart;
  return seq.map((lord) => {
    const years = (mahaYears * DASHA_YEARS[lord]) / 120;
    const start = cursor;
    const end = addYears(cursor, years);
    cursor = end;
    return { lord, start, end, years };
  });
}

/**
 * चंद्रमा के नक्षत्र के आधार पर पूरी विंशोत्तरी दशा तालिका बनाना (एक पूर्ण चक्र ~120 वर्ष)
 * @param {number} moonSiderealLongitude - चंद्रमा का निरयण देशांतर
 * @param {Date} birthDateUTC
 */
export function calculateVimshottariDasha(moonSiderealLongitude, birthDateUTC) {
  const nak = getNakshatraInfo(moonSiderealLongitude);
  const startingLordIndex = nak.index % 9;
  const startingLord = DASHA_SEQUENCE[startingLordIndex];

  // नक्षत्र में जितना अंश पार हो चुका है, उसके अनुसार पहली दशा का शेष भाग (balance)
  const fractionElapsed = nak.degreeInNakshatra / NAKSHATRA_SPAN;
  const firstDashaFullYears = DASHA_YEARS[startingLord];
  const firstDashaBalanceYears = (1 - fractionElapsed) * firstDashaFullYears;

  const seq = sequenceStartingAt(startingLord);

  const mahadashas = [];
  let cursor = birthDateUTC;

  seq.forEach((lord, i) => {
    const years = i === 0 ? firstDashaBalanceYears : DASHA_YEARS[lord];
    const start = cursor;
    const end = addYears(cursor, years);
    // अंतर्दशा गणना पूर्ण अवधि पर आधारित होती है (पहली दशा के लिए भी मानक पद्धति)
    const antardashaYears = i === 0 ? firstDashaFullYears : years;
    const antardashaStart = i === 0 ? addYears(start, -(firstDashaFullYears - firstDashaBalanceYears)) : start;
    mahadashas.push({
      lord,
      start,
      end,
      years,
      isPartial: i === 0,
      antardashas: buildAntardashas(lord, i === 0 ? antardashaStart : start, antardashaYears)
        .filter((ad) => ad.end > birthDateUTC), // जन्म से पहले बीत चुकी अंतर्दशाएँ हटाना
    });
    cursor = end;
  });

  return { nakshatra: nak, startingLord, mahadashas };
}

// आज की तारीख के अनुसार वर्तमान महादशा और अंतर्दशा पता करना
export function getCurrentDasha(dashaResult, now = new Date()) {
  const maha = dashaResult.mahadashas.find((m) => now >= m.start && now < m.end);
  if (!maha) return null;
  const antar = maha.antardashas.find((a) => now >= a.start && now < a.end);
  return { maha, antar };
}
