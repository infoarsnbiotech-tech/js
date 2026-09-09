import React, { useRef, useState } from 'react';
import { deriveSeedFromImage, generatePalmReading } from '../utils/palmReading.js';

const LINE_ROWS = [
  { key: 'lifeLine', icon: '🟢', label: 'जीवन रेखा (Life Line)' },
  { key: 'headLine', icon: '🔵', label: 'मस्तिष्क रेखा (Head Line)' },
  { key: 'heartLine', icon: '❤️', label: 'हृदय रेखा (Heart Line)' },
  { key: 'fateLine', icon: '🟡', label: 'भाग्य रेखा (Fate Line)' },
  { key: 'marriageLine', icon: '💍', label: 'विवाह रेखा (Marriage Line)' },
];

export default function PalmScan() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | analyzing | done | error
  const [reading, setReading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const cameraInputRef = useRef(null);
  const uploadInputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus('error');
      setErrorMsg('कृपया केवल इमेज फ़ाइल (फोटो) चुनें।');
      return;
    }

    setStatus('analyzing');
    setErrorMsg('');
    setReading(null);
    setFileName(file.name || 'हथेली की फोटो');

    try {
      const { seeds, overallSeed, previewUrl: url } = await deriveSeedFromImage(file);
      setPreviewUrl(url);

      // असली हस्तरेखा-विश्लेषण जैसा अनुभव देने के लिए हल्का सा प्रोसेसिंग-विराम
      await new Promise((resolve) => setTimeout(resolve, 900));

      const result = generatePalmReading({ seeds, overallSeed });
      setReading(result);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'फोटो का विश्लेषण नहीं हो पाया, कृपया दोबारा प्रयास करें।');
    }
  }

  function reset() {
    setStatus('idle');
    setReading(null);
    setPreviewUrl(null);
    setFileName('');
    setErrorMsg('');
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (uploadInputRef.current) uploadInputRef.current.value = '';
  }

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>🖐️ हस्त रेखा स्कैन (Palm Scan)</h1>
        <p>अपनी हथेली की साफ़ फोटो कैमरे से खींचें या अपलोड करें — जीवन, मस्तिष्क, हृदय, भाग्य व विवाह रेखा के अनुसार पारंपरिक हस्तरेखा भविष्यवाणी पाएँ।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="grid-2">
          <div className="card">
            <h3>📸 हथेली की फोटो लें</h3>
            <p className="muted small" style={{ marginTop: 0 }}>
              अच्छी रोशनी में, हथेली को पूरी तरह खोलकर, कैमरे के करीब रखकर फोटो लें ताकि सभी रेखाएँ स्पष्ट दिखें।
            </p>

            {previewUrl && (
              <div className="palm-preview-wrap">
                <img src={previewUrl} alt="अपलोड की गई हथेली" className="palm-preview-img" />
                <div className="small muted" style={{ marginTop: 6 }}>{fileName}</div>
              </div>
            )}

            <div className="palm-action-row">
              <button
                type="button"
                className="btn-primary"
                onClick={() => cameraInputRef.current?.click()}
                disabled={status === 'analyzing'}
              >
                📷 हथेली स्कैन करें
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => uploadInputRef.current?.click()}
                disabled={status === 'analyzing'}
              >
                🖼️ गैलरी से अपलोड करें
              </button>
              {(status === 'done' || status === 'error') && (
                <button type="button" className="small-link" onClick={reset}>
                  ↺ दोबारा स्कैन करें
                </button>
              )}
            </div>

            {/* कैमरा सीधे खोलने के लिए capture="environment" — मोबाइल पर कैमरा ऐप खुलता है */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {status === 'analyzing' && (
              <div className="highlight-box" style={{ marginTop: 16 }}>
                🔍 हथेली की रेखाओं का विश्लेषण हो रहा है...
              </div>
            )}
            {status === 'error' && (
              <div className="warning-box" style={{ marginTop: 16 }}>
                {errorMsg}
              </div>
            )}
          </div>

          <div className="card">
            <h3>हस्तरेखा शास्त्र के बारे में</h3>
            <p className="muted small" style={{ margin: 0 }}>
              हस्तरेखा शास्त्र (Palmistry / Hast Rekha Shastra) एक प्राचीन भारतीय परंपरा है, जिसमें हथेली की
              प्रमुख रेखाओं — जीवन, मस्तिष्क, हृदय, भाग्य व विवाह रेखा — तथा हथेली की बनावट के आधार पर स्वभाव,
              रुझान व जीवन की सामान्य दिशा को समझने का प्रयास किया जाता है।
            </p>
          </div>
        </div>

        {status === 'done' && reading && (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>🖐️ आपकी हस्तरेखा रिपोर्ट</h3>

            <div className="highlight-box">
              <strong>हथेली की बनावट — {reading.handShape.tag}:</strong> {reading.handShape.text}
            </div>

            {LINE_ROWS.map((row) => (
              <div className="insight-section" key={row.key}>
                <h4>{row.icon} {row.label} — {reading[row.key].tag}</h4>
                <p style={{ margin: 0 }}>{reading[row.key].text}</p>
              </div>
            ))}

            <div className="insight-section">
              <h4>✨ सार (Overall)</h4>
              <p style={{ margin: 0 }}>{reading.overallClosing}</p>
            </div>

            <p className="small muted" style={{ marginTop: 14 }}>
              ⚠️ यह विश्लेषण पारंपरिक हस्तरेखा-ज्ञान पर आधारित सामान्य व मनोरंजन-उद्देश्य की जानकारी है, कोई
              वैज्ञानिक या चिकित्सकीय निष्कर्ष नहीं। महत्वपूर्ण जीवन-निर्णयों हेतु अनुभवी हस्तरेखा विशेषज्ञ से
              प्रत्यक्ष परामर्श लें।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
