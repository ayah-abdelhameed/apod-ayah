import React, { useState, useEffect } from 'react';
import './FactGenerator.css';

const SHORT_SPACE_FACTS = [
  "A day on Venus is longer than its year, taking 243 Earth days to rotate once.",
  "Jupiter's Great Red Spot is a giant storm larger than Earth that has raged for over 300 years.",
  "Sunset on Mars appears blue because atmospheric dust scatters light differently than on Earth.",
  "One million Earths could fit inside the Sun.",
  "Saturn's rings are mostly composed of water ice, rock fragments, and cosmic dust.",
  "Olympus Mons on Mars is the largest volcano in the solar system, nearly three times taller than Mount Everest.",
  "Neutron stars can spin at a rate of up to 600 rotations per second.",
  "Footprints left on the Moon by Apollo astronauts will remain for millions of years due to the lack of wind or water erosion."
];

export default function FactGenerator() {
  const [fact, setFact] = useState('');

  const generateFact = () => {
    // Selects a random fact from the short curated list
    const randomIndex = Math.floor(Math.random() * SHORT_SPACE_FACTS.length);
    setFact(SHORT_SPACE_FACTS[randomIndex]);
  };

  useEffect(() => {
    generateFact();
  }, []);

  return (
    <section className="fact-container">
      <h2>Cosmic Discoveries</h2>
      <p className="fact">{fact}</p>
      <button onClick={generateFact} className="generate-fact">
        Generate New Fact
      </button>
    </section>
  );
}