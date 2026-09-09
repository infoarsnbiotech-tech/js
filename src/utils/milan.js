import { getRashiIndex, getNakshatraInfo, RASHI_LORDS } from './astro.js';

// ===================== संदर्भ तालिकाएँ (Reference Tables) =====================

// राशि अनुसार वर्ण (0=मेष...11=मीन)
const VARNA_BY_RASHI = ['क्षत्रिय', 'वैश्य', 'शूद्र', 'ब्राह्मण', 'क्षत्रिय', 'वैश्य', 'शूद्र', 'ब्राह्मण', 'क्षत्रिय', 'वैश्य', 'शूद्र', 'ब्राह्मण'];
const VARNA_RANK = { 'ब्राह्मण': 4, 'क्षत्रिय': 3, 'वैश्य': 2, 'शूद्र': 1 };

// राशि अनुसार वश्य समूह
const VASHYA_BY_RASHI = ['चतुष्पद', 'चतुष्पद', 'मानव', 'जलचर', 'वनचर', 'मानव', 'मानव', 'कीट', 'मानव', 'चतुष्पद', 'मानव', 'जलचर'];
const VASHYA_MATRIX = {
  चतुष्पद: { चतुष्पद: 2, मानव: 1, जलचर: 0.5, वनचर: 0, कीट: 1 },
  मानव: { चतुष्पद: 1, मानव: 2, जलचर: 1, वनचर: 0, कीट: 1 },
  जलचर: { चतुष्पद: 0.5, मानव: 1, जलचर: 2, वनचर: 0, कीट: 1 },
  वनचर: { चतुष्पद: 0, मानव: 0, जलचर: 0, वनचर: 2, कीट: 0 },
  कीट: { चतुष्पद: 1, मानव: 1, जलचर: 1, वनचर: 0, कीट: 2 },
};

// नक्षत्र अनुसार योनि (27 नक्षत्र)
const YONI_BY_NAKSHATRA = [
  'अश्व', 'गज', 'मेष', 'सर्प', 'सर्प', 'श्वान', 'बिलाव', 'मेष', 'बिलाव',
  'मूषक', 'मूषक', 'गौ', 'महिष', 'व्याघ्र', 'महिष', 'व्याघ्र', 'मृग', 'मृग',
  'श्वान', 'वानर', 'नकुल', 'वानर', 'सिंह', 'अश्व', 'सिंह', 'गौ', 'गज',
];
// शत्रु योनि जोड़े
const YONI_ENEMIES = [
  ['सर्प', 'नकुल'], ['गौ', 'व्याघ्र'], ['अश्व', 'महिष'], ['श्वान', 'मृग'],
  ['बिलाव', 'मूषक'], ['सिंह', 'गज'], ['वानर', 'मेष'],
];
const YONI_FRIENDS = [
  ['अश्व', 'गज'], ['मृग', 'गौ'], ['मेष', 'वानर'], ['सर्प', 'मूषक'],
];

// नक्षत्र अनुसार गण
const GANA_BY_NAKSHATRA = [
  'देव', 'मनुष्य', 'राक्षस', 'मनुष्य', 'देव', 'मनुष्य', 'देव', 'देव', 'राक्षस',
  'राक्षस', 'मनुष्य', 'मनुष्य', 'देव', 'राक्षस', 'देव', 'राक्षस', 'देव', 'राक्षस',
  'राक्षस', 'मनुष्य', 'मनुष्य', 'देव', 'राक्षस', 'राक्षस', 'मनुष्य', 'मनुष्य', 'देव',
];
const GANA_MATRIX = {
  देव: { देव: 6, मनुष्य: 5, राक्षस: 1 },
  मनुष्य: { देव: 6, मनुष्य: 6, राक्षस: 0 },
  राक्षस: { देव: 0, मनुष्य: 0, राक्षस: 6 },
};

// नक्षत्र अनुसार नाड़ी
const NADI_BY_NAKSHATRA = [
  'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य',
  'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य',
  'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य', 'आदि', 'मध्य', 'अंत्य',
];

// ग्रह मैत्री (प्राकृतिक मित्रता)
const FRIENDSHIP = {
  सूर्य: { मित्र: ['चंद्र', 'मंगल', 'गुरु'], सम: ['बुध'], शत्रु: ['शुक्र', 'शनि'] },
  चंद्र: { मित्र: ['सूर्य', 'बुध'], सम: ['मंगल', 'गुरु', 'शुक्र', 'शनि'], शत्रु: [] },
  मंगल: { मित्र: ['सूर्य', 'चंद्र', 'गुरु'], सम: ['शुक्र', 'शनि'], शत्रु: ['बुध'] },
  बुध: { मित्र: ['सूर्य', 'शुक्र'], सम: ['मंगल', 'गुरु', 'शनि'], शत्रु: ['चंद्र'] },
  गुरु: { मित्र: ['सूर्य', 'चंद्र', 'मंगल'], सम: ['शनि'], शत्रु: ['बुध', 'शुक्र'] },
  शुक्र: { मित्र: ['बुध', 'शनि'], सम: ['मंगल', 'गुरु'], शत्रु: ['सूर्य', 'चंद्र'] },
  शनि: { मित्र: ['बुध', 'शुक्र'], सम: ['गुरु'], शत्रु: ['सूर्य', 'चंद्र', 'मंगल'] },
};

function relation(a, b) {
  if (a === b) return 'मित्र';
  if (FRIENDSHIP[a].मित्र.includes(b)) return 'मित्र';
  if (FRIENDSHIP[a].शत्रु.includes(b)) return 'शत्रु';
  return 'सम';
}

function grahaMaitriScore(lordA, lordB) {
  const r1 = relation(lordA, lordB);
  const r2 = relation(lordB, lordA);
  if (r1 === 'मित्र' && r2 === 'मित्र') return 5;
  if ((r1 === 'मित्र' && r2 === 'सम') || (r2 === 'मित्र' && r1 === 'सम')) return 4;
  if (r1 === 'सम' && r2 === 'सम') return 3;
  if ((r1 === 'मित्र' && r2 === 'शत्रु') || (r2 === 'मित्र' && r1 === 'शत्रु')) return 1;
  if ((r1 === 'सम' && r2 === 'शत्रु') || (r2 === 'सम' && r1 === 'शत्रु')) return 1;
  return 0;
}

function yoniScore(y1, y2) {
  if (y1 === y2) return 4;
  const isPair = (list) => list.some(([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1));
  if (isPair(YONI_ENEMIES)) return 0;
  if (isPair(YONI_FRIENDS)) return 3;
  return 2;
}

function taraScore(nakA, nakB) {
  const count1 = ((nakB - nakA + 27) % 27) + 1;
  const count2 = ((nakA - nakB + 27) % 27) + 1;
  const bad = (c) => [3, 5, 7].includes(((c - 1) % 9) + 1);
  let total = 0;
  total += bad(count1) ? 0 : 1.5;
  total += bad(count2) ? 0 : 1.5;
  return total;
}

function bhakootScore(rashiA, rashiB) {
  const diff = Math.abs(rashiA - rashiB);
  const d = Math.min(diff, 12 - diff);
  // 2-12 (d=1), 6-8 (d=5 counted as 6th/8th relationship -> here d==5 या 7 पर विचार)
  const doshaDistances = [1, 4, 5];
  if (doshaDistances.includes(d)) return 0;
  return 7;
}

// ===================== कूट-वार विवरण व उपाय (जब गुण पूरे न मिलें) =====================
export const KOOTA_INFO = {
  वर्ण: {
    meaning: 'वर्ण कूट दोनों के आध्यात्मिक स्वभाव व कार्यशैली की अनुकूलता दर्शाता है। कम अंक मिलने पर वर-वधू की सोच व जीवन के प्रति दृष्टिकोण में शुरुआती अंतर महसूस हो सकता है।',
    remedy: 'आपसी संवाद व एक-दूसरे के दृष्टिकोण को समझने का सचेत प्रयास इस अंतर को स्वाभाविक रूप से पाटने में सहायक रहता है — इसके लिए कोई विशेष पूजा आवश्यक नहीं मानी जाती।',
  },
  वश्य: {
    meaning: 'वश्य कूट दर्शाता है कि रिश्ते में कौन किस पर सहज प्रभाव रखेगा। कम अंक मिलने पर आरंभ में नियंत्रण/अहं को लेकर मामूली खिंचाव हो सकता है।',
    remedy: 'दोनों परिवारों के बड़ों का मार्गदर्शन व एक-दूसरे को स्थान देने की भावना रिश्ते में संतुलन बनाए रखने में सहायक मानी जाती है।',
  },
  तारा: {
    meaning: 'तारा कूट परस्पर भलाई, स्वास्थ्य व सामान्य कल्याण से जुड़ा है। कम अंक स्वास्थ्य व सामान्य जीवन में थोड़ी अतिरिक्त सावधानी के संकेत के रूप में देखा जाता है।',
    remedy: 'नियमित पूजा-पाठ व एक-दूसरे के स्वास्थ्य का ध्यान रखना पारंपरिक रूप से इस कूट के प्रभाव को संतुलित करने हेतु पर्याप्त माना जाता है।',
  },
  योनि: {
    meaning: 'योनि कूट शारीरिक व मानसिक (यौन) अनुकूलता का सूचक माना जाता है। यदि दोनों की योनि "शत्रु" श्रेणी में आती है, तो आरंभ में कुछ सामंजस्य बिठाने की आवश्यकता पड़ सकती है।',
    remedy: 'धैर्य, खुला व सहज संवाद तथा एक-दूसरे को समय देना — यह पारंपरिक रूप से इस कूट के असंतुलन को समय के साथ ठीक करने का सुझाव है।',
  },
  'ग्रह मैत्री': {
    meaning: 'ग्रह मैत्री कूट दोनों की राशियों के स्वामी ग्रहों के बीच मित्रता/शत्रुता के आधार पर मानसिक तालमेल दर्शाता है। कम अंक विचारों में मतभेद के सामान्य संकेत के रूप में देखा जाता है।',
    remedy: 'दोनों राशि-स्वामी ग्रहों से संबंधित शुभ दिन का पालन (जैसे उपवास या दान) व परस्पर समझदारी विकसित करने का प्रयास सहायक माना जाता है।',
  },
  गण: {
    meaning: 'गण कूट (देव, मनुष्य, राक्षस) स्वभाव व प्रकृति की अनुकूलता दर्शाता है। "देव-राक्षस" जैसा संयोजन होने पर स्वभाव में स्पष्ट अंतर महसूस हो सकता है।',
    remedy: 'एक-दूसरे के स्वभाव को स्वीकार करने व असहमति में संयम रखने की सीख इस कूट के असंतुलन को संभालने का पारंपरिक सुझाव है।',
  },
  भकूट: {
    meaning: 'भकूट दोष (राशियों की 2-12, 5-9 अथवा 6-8 दूरी पर) परिवार की समृद्धि व दांपत्य प्रेम में बाधा का पारंपरिक संकेत माना जाता है।',
    remedy: 'भकूट दोष निवारण हेतु विवाह से पूर्व विद्वान पंडित से विशेष पूजा/शांति कर्म करवाने की सलाह दी जाती है। कई बार राशि-स्वामी मित्र होने पर यह दोष स्वतः कम प्रभावी माना जाता है — पूर्ण कुंडली दिखाकर पुष्टि करें।',
  },
  नाड़ी: {
    meaning: 'नाड़ी कूट (सबसे भारी, 8 अंक) संतान-सुख व स्वास्थ्य से जुड़ा माना जाता है। दोनों की नाड़ी एक समान होने पर नाड़ी दोष बनता है, जो परंपरागत रूप से सबसे गंभीर माना जाने वाला दोष है।',
    remedy: 'नाड़ी दोष निवारण पूजा (महामृत्युंजय जाप सहित), भिन्न गण/राशि होने पर दोष के प्रभाव में छूट, तथा किसी अनुभवी ज्योतिषी से पूर्ण कुंडली दिखाकर परामर्श लेना अत्यंत आवश्यक माना जाता है।',
  },
};

// ===================== मुख्य मिलान फंक्शन (Main Matching Function) =====================

/**
 * @param {number} moonLonBride - वधू की चंद्र राशि/नक्षत्र हेतु निरयण देशांतर
 * @param {number} moonLonGroom - वर की चंद्र राशि/नक्षत्र हेतु निरयण देशांतर
 */
export function calculateKundliMilan(moonLonBride, moonLonGroom) {
  const rashiBride = getRashiIndex(moonLonBride);
  const rashiGroom = getRashiIndex(moonLonGroom);
  const nakBride = getNakshatraInfo(moonLonBride).index;
  const nakGroom = getNakshatraInfo(moonLonGroom).index;

  const results = [];

  // 1. वर्ण (1 अंक)
  const varnaB = VARNA_BY_RASHI[rashiBride];
  const varnaG = VARNA_BY_RASHI[rashiGroom];
  const varna = VARNA_RANK[varnaG] >= VARNA_RANK[varnaB] ? 1 : 0;
  results.push({ koota: 'वर्ण', max: 1, score: varna, detail: `वधू: ${varnaB}, वर: ${varnaG}` });

  // 2. वश्य (2 अंक)
  const vashyaB = VASHYA_BY_RASHI[rashiBride];
  const vashyaG = VASHYA_BY_RASHI[rashiGroom];
  const vashya = VASHYA_MATRIX[vashyaG][vashyaB];
  results.push({ koota: 'वश्य', max: 2, score: vashya, detail: `वधू: ${vashyaB}, वर: ${vashyaG}` });

  // 3. तारा (3 अंक)
  const tara = taraScore(nakBride, nakGroom);
  results.push({ koota: 'तारा', max: 3, score: tara, detail: 'नक्षत्र गणना अनुसार' });

  // 4. योनि (4 अंक)
  const yoniB = YONI_BY_NAKSHATRA[nakBride];
  const yoniG = YONI_BY_NAKSHATRA[nakGroom];
  const yoni = yoniScore(yoniB, yoniG);
  results.push({ koota: 'योनि', max: 4, score: yoni, detail: `वधू: ${yoniB}, वर: ${yoniG}` });

  // 5. ग्रह मैत्री (5 अंक)
  const lordB = RASHI_LORDS[rashiBride];
  const lordG = RASHI_LORDS[rashiGroom];
  const maitri = grahaMaitriScore(lordB, lordG);
  results.push({ koota: 'ग्रह मैत्री', max: 5, score: maitri, detail: `वधू राशि स्वामी: ${lordB}, वर राशि स्वामी: ${lordG}` });

  // 6. गण (6 अंक)
  const ganaB = GANA_BY_NAKSHATRA[nakBride];
  const ganaG = GANA_BY_NAKSHATRA[nakGroom];
  const gana = GANA_MATRIX[ganaG][ganaB];
  results.push({ koota: 'गण', max: 6, score: gana, detail: `वधू: ${ganaB} गण, वर: ${ganaG} गण` });

  // 7. भकूट (7 अंक)
  const bhakoot = bhakootScore(rashiBride, rashiGroom);
  results.push({ koota: 'भकूट', max: 7, score: bhakoot, detail: 'चंद्र राशि दूरी अनुसार' });

  // 8. नाड़ी (8 अंक)
  const nadiB = NADI_BY_NAKSHATRA[nakBride];
  const nadiG = NADI_BY_NAKSHATRA[nakGroom];
  const nadi = nadiB === nadiG ? 0 : 8;
  results.push({ koota: 'नाड़ी', max: 8, score: nadi, detail: `वधू: ${nadiB} नाड़ी, वर: ${nadiG} नाड़ी${nadiB === nadiG ? ' (नाड़ी दोष)' : ''}` });

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalMax = 36;

  let verdict = '';
  if (totalScore >= 28) verdict = 'उत्तम मेल (Excellent Match)';
  else if (totalScore >= 21) verdict = 'अच्छा मेल (Good Match)';
  else if (totalScore >= 18) verdict = 'औसत मेल (Average Match)';
  else verdict = 'कमज़ोर मेल - विचार आवश्यक (Poor Match - Consultation Advised)';

  return {
    results,
    totalScore,
    totalMax,
    verdict,
    nadiDosha: nadiB === nadiG,
    bhakootDosha: bhakoot === 0,
  };
}
