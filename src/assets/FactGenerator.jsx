import React, { useState, useEffect } from 'react';
import './FactGenerator.css';

export default function FactGenerator() {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFact = async () => {
    setLoading(true);
    try {
      const randomYear = 2020 + Math.floor(Math.random() * 5);
      const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const randomDate = `${randomYear}-${randomMonth}-${randomDay}`;

      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=qrgw7uuQCM60iDG6QJ4X6d6jo2xSnb5CPkRDfh1w&date=${randomDate}`
      );

      if (!res.ok) throw new Error('NASA API error');

      const data = await res.json();
      
      const sentences = data.explanation.split('. ');
      const shortFact = sentences.length > 1 ? `${sentences[0]}.` : data.explanation;

      setFact(`${data.title}: ${shortFact}`);
    } catch (err) {
      const fallbacks = [
        "Jupiter's Great Red Spot is a giant storm bigger than Earth that has raged for centuries.",
        "One day on Venus is longer than one year on Venus.",
        "Sunset on Mars appears blue due to light scattering off fine atmospheric dust.",
        "Saturn's rings are mostly composed of water ice, rock, and carbon dust."
      ];
      setFact(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <section className="fact-container">
      <h2>Stellar Fact Generator</h2>
      <p className="fact">{loading ? 'Loading space fact...' : fact}</p>
      <button onClick={fetchFact} className="generate-fact" disabled={loading}>
        Generate New Fact
      </button>
    </section>
  );
}