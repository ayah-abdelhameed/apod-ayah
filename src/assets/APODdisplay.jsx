import React, { useState, useEffect } from 'react';
import './APODdisplay.css';

const APODApiKey = 'qrgw7uuQCM60iDG6QJ4X6d6jo2xSnb5CPkRDfh1w';

function getTodayLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toYYMMDD(dateStr = '') {
  const clean = dateStr.slice(0, 10);
  const [y, m, d] = clean.split('-');
  if (!y || !m || !d) return '';
  return `${y.slice(-2)}${m}${d}`;
}

function formatExplanationHtml(htmlString = '') {
  if (!htmlString) return '';
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  doc.querySelectorAll('a').forEach((link) => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}

function APODdisplay({ selectedDate, onPreviousDate, onNextDate }) {
  const [apodData, setApodData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const todayStr = getTodayLocalDateString();
  const isToday = selectedDate === todayStr;

  const formatDate = (ds) => {
    if (!ds) return '';
    const cleanDate = ds.slice(0, 10);
    const [y, m, d] = cleanDate.split('-');
    return `${m}/${d}/${y}`;
  };

  useEffect(() => {
    async function fetchAPOD() {
      setIsLoading(true);
      setError(null);
      try {
        const yymmdd = toYYMMDD(selectedDate);
        const response = await fetch(
          `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${yymmdd}?api_key=${APODApiKey}`
        );
        if (!response.ok) {
          const msg =
            response.status === 404
              ? `No APOD found for ${selectedDate}.`
              : `HTTP error: ${response.status}`;
          throw new Error(msg);
        }

        const apodJson = await response.json();
        console.log('Fetched APOD Data for', selectedDate, apodJson);

        const item = Array.isArray(apodJson)
          ? apodJson.find((entry) => entry.date?.startsWith(selectedDate)) || null
          : apodJson;

        setApodData(item);
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

  const titleText =
    typeof apodData.title === 'object'
      ? apodData.title?.rendered
      : apodData.title;

  const rawExplanation =
    typeof apodData.explanation === 'object'
      ? apodData.explanation?.rendered
      : apodData.explanation;

  const formattedExplanation = formatExplanationHtml(rawExplanation);
  const imageSrc = apodData.hdurl || apodData.url;
  const isVideo = apodData.media_type === 'video';
  const isNasaArticleUrl =
    typeof apodData.url === 'string' &&
    apodData.url.includes('science.nasa.gov/');
  const displayDate = formatDate(apodData.date || selectedDate);

  return (
    <div className="apod-container">
      <nav className="apod-nav-container">
        <button onClick={onPreviousDate}>&lt;</button>
        <figure className="apod-figure">
          {isVideo ? (
            isNasaArticleUrl ? (
              <div className="apod-external-link">
                <p>
                  NASA hosts this media on its article page rather than an
                  embeddable player.
                </p>
                <a
                  href={apodData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on NASA Science &rarr;
                </a>
              </div>
            ) : (
              <iframe
                className="apod-vid"
                title="APOD Video"
                src={apodData.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <img
              className="apod-img"
              src={imageSrc}
              alt={apodData.alt || titleText || 'Astronomy Picture of the Day'}
            />
          )}
          <figcaption>
            <h2>
              {titleText} – {displayDate}
            </h2>
          </figcaption>
        </figure>
        <button
          onClick={onNextDate}
          disabled={isToday}
          className={isToday ? 'disabled-arrow' : ''}
        >
          &gt;
        </button>
      </nav>
      <p
        className="explanation"
        dangerouslySetInnerHTML={{ __html: formattedExplanation }}
      />
    </div>
  );
}

export default APODdisplay;