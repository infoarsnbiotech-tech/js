# वैदिक ज्योतिष वेब ऐप (React)

React + Vite आधारित ज्योतिष ऐप जिसमें है:
- जन्म कुंडली (ग्रह स्थिति, राशि, नक्षत्र, पद)
- कुंडली चार्ट (दक्षिण भारतीय शैली)
- विंशोत्तरी दशा (महादशा + अंतर्दशा)
- कुंडली मिलान (अष्टकूट गुण मिलान - 36 गुण पद्धति)
- पूरी UI हिंदी में

## चलाने का तरीका (Setup)

```bash
npm install
npm run dev
```

फिर ब्राउज़र में http://localhost:5173 खोलें।

Production build के लिए:
```bash
npm run build
```

## गणना पद्धति के बारे में (Important Notes)

- ग्रहों की गणना **astronomy-engine** लाइब्रेरी (VSOP87 / NOVAS आधारित, ±1 आर्कमिनट सटीकता) से browser में ही होती है — कोई backend/server नहीं चाहिए।
- **Lahiri Ayanamsa** को polynomial approximation से निकाला गया है ताकि सायन (Tropical) देशांतर को निरयण (Sidereal) में बदला जा सके।
- **राहु-केतु** के लिए Mean Node (माध्य राहु) पद्धति उपयोग की गई है, जो अधिकतर सॉफ्टवेयर में default होती है। सटीक True Node चाहिए तो `src/utils/astro.js` में `meanRahuLongitude` फंक्शन बदलें।
- **लग्न (Ascendant)** मानक खगोलीय सूत्र (Local Sidereal Time + Obliquity) से निकाला गया है।
- यह पद्धति असली Swiss Ephemeris (native C library) जितनी ही सटीक astronomical data देती है क्योंकि दोनों एक जैसे planetary theory models पर आधारित हैं, लेकिन Swiss Ephemeris की तरह पूरी तरह native binary की ज़रूरत नहीं — इसलिए pure browser app संभव हुआ।
- **कुंडली मिलान** में Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi — सभी 8 कूट शामिल हैं (मानक तालिकाओं पर आधारित, कुछ traditions में मामूली भिन्नता हो सकती है)।
- **जन्म स्थान खोज (Location Autocomplete)**: टाइप करते ही OpenStreetMap की मुफ़्त **Nominatim** geocoding सेवा से सुझाव आते हैं और अक्षांश/देशांतर अपने-आप भर जाते हैं — front-end user को coordinates खुद ढूँढने की ज़रूरत नहीं। छोटे गाँव जो सूची में न मिलें, उनके लिए "अक्षांश-देशांतर खुद डालें" वाला विकल्प भी दिया गया है।
  - ⚠️ **ध्यान दें**: Nominatim की उपयोग-नीति (usage policy) के अनुसार हल्के/personal उपयोग के लिए यह मुफ़्त है, पर बड़े पैमाने पर (production, बहुत सारे users) उपयोग के लिए अपना खुद का geocoding backend, Nominatim self-host, या किसी paid provider (जैसे Google Places, Mapbox, OpenCage) का इस्तेमाल करना बेहतर रहेगा।

## आगे क्या जोड़ सकते हैं (Suggested Next Steps)

- शुभ-अशुभ योग (Yoga) पहचान
- गोचर (Transit) विश्लेषण
- होरा/नवमांश जैसी divisional charts (D-9, D-10)
- PDF रिपोर्ट डाउनलोड
- Location से lat/lon auto-fetch (city search API जोड़ना)

## फोल्डर संरचना

```
src/
  utils/
    astro.js    -> ग्रह गणना, राशि, नक्षत्र, लग्न
    dasha.js    -> विंशोत्तरी दशा
    milan.js    -> कुंडली मिलान (अष्टकूट)
  components/
    BirthForm.jsx
    KundliChart.jsx
    GrahTable.jsx
    DashaTable.jsx
    KundliMilanResult.jsx
  App.jsx
  main.jsx
  styles.css
```
