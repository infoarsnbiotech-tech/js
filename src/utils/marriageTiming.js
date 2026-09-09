import { marriageInsight } from './personalInsights.js';

const KARAKAS = ['शुक्र', 'गुरु']; // विवाह के सार्वभौमिक कारक ग्रह (शुक्र व गुरु)

/**
 * किसी व्यक्ति की विंशोत्तरी दशा में से विवाह हेतु सर्वाधिक अनुकूल अवधि निकालना —
 * जहाँ महादशा व अंतर्दशा दोनों के स्वामी शुक्र/गुरु/सप्तमेश में से हों (double-favourable)।
 */
export function findBestMarriageWindows(chart, dashaResult) {
  const insight = marriageInsight(chart);
  const relevantLords = new Set([...KARAKAS, insight.lord]);
  const windows = [];

  dashaResult.mahadashas.forEach((maha) => {
    if (!relevantLords.has(maha.lord)) return;
    maha.antardashas.forEach((antar) => {
      if (relevantLords.has(antar.lord)) {
        windows.push({ mahaLord: maha.lord, antarLord: antar.lord, start: antar.start, end: antar.end });
      }
    });
  });

  return windows.sort((a, b) => a.start - b.start);
}

/**
 * केवल महादशा-स्तर पर शुक्र/गुरु/सप्तमेश की अवधि (कुंडली मिलान हेतु व्यापक ओवरलैप निकालने के लिए)
 */
export function findFavorableMahadashas(chart, dashaResult) {
  const insight = marriageInsight(chart);
  const relevantLords = new Set([...KARAKAS, insight.lord]);
  return dashaResult.mahadashas
    .filter((m) => relevantLords.has(m.lord))
    .map((m) => ({ lord: m.lord, start: m.start, end: m.end }));
}

/**
 * दो अवधि-सूचियों (वर व वधू) के बीच ओवरलैप (समान रूप से शुभ समय) निकालना
 */
export function intersectWindows(listA, listB, minDays = 25) {
  const result = [];
  listA.forEach((a) => {
    listB.forEach((b) => {
      const start = a.start > b.start ? a.start : b.start;
      const end = a.end < b.end ? a.end : b.end;
      if (end > start) {
        const days = (end - start) / (1000 * 60 * 60 * 24);
        if (days >= minDays) {
          result.push({ start, end, brideLord: a.lord, groomLord: b.lord });
        }
      }
    });
  });
  return result.sort((x, y) => x.start - y.start);
}
