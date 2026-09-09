import React, { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !message) {
      alert('कृपया अपना नाम व संदेश भरें');
      return;
    }
    const subject = encodeURIComponent(`संपर्क फॉर्म — ${name}`);
    const body = encodeURIComponent(`नाम: ${name}\nईमेल: ${email}\n\nसंदेश:\n${message}`);
    window.location.href = `mailto:ankit7659@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="hc-page">
      <section className="hc-hero">
        <h1>📩 संपर्क करें</h1>
        <p>कुंडली, विवाह मिलान, मुहूर्त या किसी भी ज्योतिषीय प्रश्न हेतु हमसे संपर्क करें।</p>
      </section>

      <div className="app-container" style={{ padding: '24px 0' }}>
        <div className="grid-2">
          <form className="birth-form" onSubmit={handleSubmit}>
            <h3>संदेश भेजें</h3>
            <div className="form-row">
              <label>आपका नाम</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="जैसे: राम कुमार" required />
            </div>
            <div className="form-row">
              <label>ईमेल (वैकल्पिक)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jaise@example.com" />
            </div>
            <div className="form-row">
              <label>संदेश</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="अपना प्रश्न या ज़रूरत यहाँ लिखें..."
                rows={5}
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn-primary">✉️ ईमेल द्वारा भेजें</button>
            {sent && <p className="small muted" style={{ marginTop: 8 }}>आपका ईमेल ऐप खुल गया है — कृपया वहां से भेजें।</p>}
          </form>

          <div className="card">
            <h3>सीधे संपर्क करें</h3>
            <p className="muted small">तुरंत जवाब हेतु WhatsApp या ईमेल के ज़रिए सीधे संपर्क करें।</p>

            <div className="insight-section">
              <h4>✉️ ईमेल</h4>
              <p style={{ margin: 0 }}><a href="mailto:ankit7659@gmail.com">ankit7659@gmail.com</a></p>
            </div>

            <div className="insight-section">
              <h4>💬 WhatsApp</h4>
              <a
                className="footer-whatsapp-btn"
                style={{ display: 'inline-flex', marginTop: 6 }}
                href="https://wa.me/917888426916?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%9C%E0%A5%8D%E0%A4%AF%E0%A5%8B%E0%A4%A4%E0%A4%BF%E0%A4%B7%20%E0%A4%B8%E0%A4%B2%E0%A4%BE%E0%A4%B9%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 WhatsApp: 7888426916
              </a>
            </div>

            <div className="insight-section">
              <h4>🕐 उपलब्धता</h4>
              <p style={{ margin: 0 }}>सोमवार–शनिवार, सुबह 9:00 बजे से रात 8:00 बजे तक</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
