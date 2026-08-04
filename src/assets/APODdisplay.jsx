import React, { useState, useEffect } from 'react';
import './APODDisplay.css';

const APODApiKey = 'qrgw7uuQCM60iDG6QJ4X6d6jo2xSnb5CPkRDfh1w';

function getTodayLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function APODDisplay({ selectedDate, onPreviousDate, onNextDate }) {
  const [apodData, setApodData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const todayStr = getTodayLocalDateString();
  const isToday = selectedDate === todayStr;

  const formatDate = (ds) => {
    const [y, m, d] = ds.split('-');
    return `${m}/${d}/${y}`;
  };

  useEffect(() => {
    async function fetchAPOD() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${APODApiKey}&date=${selectedDate}`
        );
        if (!response.ok) {
          const msg =
            response.status === 404
              ? `No APOD found for ${selectedDate}.`
              : `HTTP error: ${response.status}`;
          throw new Error(msg);
        }
        setApodData(await response.json());
      } catch (e) {
        setError(e.message);
        setApodData(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAPOD();
  }, [selectedDate]);

  if (isLoading) return <p>Loading APOD...</p>;
  if (error) return <p>APOD error: {error}</p>;
  if (!apodData) return <p>No APOD available for {selectedDate}</p>;

  return (
    <div className="apod-container">
      <nav className="apod-nav-container">
        <button onClick={onPreviousDate}>&lt;</button>
        <figure className="apod-figure">
          {apodData.media_type === 'image' ? (
            <img className="apod-img" src={apodData.url} alt={apodData.title} />
          ) : (
            <iframe
              className="apod-vid"
              title="APOD"
              src={apodData.url}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
          <figcaption>
            <h2>
              {apodData.title} – {formatDate(selectedDate)}
            </h2>
          </figcaption>
        </figure>
        <button onClick={onNextDate} disabled={isToday} className={isToday ? 'disabled-arrow' : ''}>
          &gt;
        </button>
      </nav>
      <p className="explanation">{apodData.explanation}</p>
    </div>
  );
}

export default APODDisplay;