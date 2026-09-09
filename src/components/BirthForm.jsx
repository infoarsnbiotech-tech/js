import React, { useState } from 'react';
import LocationSearch from './LocationSearch.jsx';

export default function BirthForm({ title, onSubmit }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [tzChoice, setTzChoice] = useState('5.5'); // dropdown value, ya 'custom'
  const [customTz, setCustomTz] = useState('');
  const tzOffset = tzChoice === 'custom' ? customTz : tzChoice;
  const [place, setPlace] = useState(null); // { placeName, latitude, longitude }
  const [manualMode, setManualMode] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const latitude = manualMode ? parseFloat(manualLat) : place?.latitude;
    const longitude = manualMode ? parseFloat(manualLon) : place?.longitude;

    if (!date || !time || latitude === undefined || longitude === undefined || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      alert('कृपया जन्म तारीख, समय और जन्म स्थान (सूची में से चुनें) भरें');
      return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const localMillis = Date.UTC(year, month - 1, day, hour, minute);
    const utcDate = new Date(localMillis - parseFloat(tzOffset) * 60 * 60 * 1000);

    onSubmit({
      name,
      placeName: manualMode ? 'मैन्युअल स्थान' : place?.placeName,
      date,
      time,
      tzOffset: parseFloat(tzOffset),
      latitude,
      longitude,
      utcDate,
    });
  }

  return (
    <form className="birth-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>
      <div className="form-row">
        <label>नाम</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="जैसे: राम कुमार" />
      </div>
      <div className="form-row">
        <label>जन्म तारीख</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>जन्म समय</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      </div>

      {!manualMode && (
        <div className="form-row">
          <LocationSearch onSelect={setPlace} />
          <button type="button" className="btn-link small-link" onClick={() => setManualMode(true)}>
            अपना गाँव/स्थान सूची में नहीं मिल रहा? अक्षांश-देशांतर खुद डालें
          </button>
        </div>
      )}

      {manualMode && (
        <>
          <div className="form-row two-col">
            <div>
              <label>अक्षांश (Latitude)</label>
              <input type="number" step="any" value={manualLat} onChange={(e) => setManualLat(e.target.value)} placeholder="जैसे: 28.6139" required />
            </div>
            <div>
              <label>देशांतर (Longitude)</label>
              <input type="number" step="any" value={manualLon} onChange={(e) => setManualLon(e.target.value)} placeholder="जैसे: 77.2090" required />
            </div>
          </div>
          <button type="button" className="btn-link small-link" onClick={() => setManualMode(false)}>
            वापस स्थान खोजें (Search) पर जाएँ
          </button>
        </>
      )}

      <div className="form-row">
        <label>समय-क्षेत्र (Timezone)</label>
        <select value={tzChoice} onChange={(e) => setTzChoice(e.target.value)}>
          <option value="5.5">भारत (India) — IST, +5:30</option>
          <option value="0">यूके/लंदन (UK) — GMT, +0:00</option>
          <option value="-5">अमेरिका पूर्वी (US East) — EST, -5:00</option>
          <option value="-8">अमेरिका पश्चिमी (US West) — PST, -8:00</option>
          <option value="4">दुबई/UAE — +4:00</option>
          <option value="8">सिंगापुर/चीन — +8:00</option>
          <option value="9">जापान — +9:00</option>
          <option value="custom">अन्य (Custom — नीचे दर्ज करें)</option>
        </select>
        {tzChoice === 'custom' && (
          <input
            type="number"
            step="any"
            value={customTz}
            placeholder="जैसे: 5.5 या -3"
            onChange={(e) => setCustomTz(e.target.value)}
            style={{ marginTop: 6 }}
          />
        )}
      </div>
      <button type="submit" className="btn-primary">कुंडली बनाएँ</button>
    </form>
  );
}
