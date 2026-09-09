import React, { useState, useEffect, useRef } from 'react';

// OpenStreetMap Nominatim - मुफ़्त geocoding सेवा, कोई API key नहीं चाहिए (React-only apps के लिए उपयुक्त)
const SEARCH_URL = 'https://nominatim.openstreetmap.org/search';

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [selected, setSelected] = useState(null);
  const debounceRef = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    // बाहर क्लिक करने पर सुझाव-सूची बंद करना
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selected && query === selected.label) return; // चुने हुए स्थान को फिर से खोजने से रोकना
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const url = `${SEARCH_URL}?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(query)}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        const data = await res.json();
        setSuggestions(data);
        setShowList(true);
      } catch (err) {
        console.error('स्थान खोज में समस्या:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce - Nominatim की उपयोग-नीति के अनुसार अनावश्यक रिक्वेस्ट रोकना
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function handlePick(place) {
    const label = place.display_name;
    setQuery(label);
    setSelected({ label, lat: place.lat, lon: place.lon });
    setShowList(false);
    onSelect({
      placeName: label,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
    });
  }

  return (
    <div className="location-search" ref={boxRef}>
      <label>जन्म स्थान (शहर/गाँव टाइप करें)</label>
      <div className="location-input-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          onFocus={() => suggestions.length > 0 && setShowList(true)}
          placeholder="जैसे: दिल्ली, मुंबई, लुधियाना..."
          autoComplete="off"
        />
        {loading && <span className="location-spinner">खोज रहे हैं...</span>}
      </div>

      {showList && suggestions.length > 0 && (
        <ul className="location-suggestions">
          {suggestions.map((place) => (
            <li key={place.place_id} onClick={() => handlePick(place)}>
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {showList && !loading && query.trim().length >= 3 && suggestions.length === 0 && (
        <ul className="location-suggestions">
          <li className="no-result">कोई स्थान नहीं मिला — नाम अलग तरीके से लिखकर देखें</li>
        </ul>
      )}

      {selected && (
        <p className="location-confirmed">
          ✅ चुना गया स्थान — अक्षांश: {parseFloat(selected.lat).toFixed(4)}, देशांतर: {parseFloat(selected.lon).toFixed(4)}
        </p>
      )}
    </div>
  );
}
