import React, {useState} from 'react';
import './App.css'
import APODDisplay from './assets/APODdisplay'
import Calendar from './assets/Calendar';
import FactGenerator from './assets/FactGenerator';

function getTodayLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayLocalDateString());

  const shiftDate = (dateStr, days) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      date.setDate(date.getDate() + days);
      const newY = date.getFullYear();
      const newM = String(date.getMonth() + 1).padStart(2, '0');
      const newD = String(date.getDate()).padStart(2, '0');
      return `${newY}-${newM}-${newD}`;
    };

  const handlePrevDate = () => {
    setSelectedDate(prev => shiftDate(prev, -1));
  };

  const handleNextDate = () => {
    setSelectedDate(prev => shiftDate(prev, 1));
  };

  const handleDatePick = (dateStr) => {
    setSelectedDate(dateStr);
  };

   return (
    <main className="container">
      <h1>Astronomy Picture of the Day</h1>

      <section className="apod-section">
        <APODDisplay
          selectedDate={selectedDate}
          onPreviousDate={handlePrevDate}
          onNextDate={handleNextDate}
        />
      </section>

      <section className="calendar-section">
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDatePick}
        />
      </section>

      <article className="description">
        <h2>Discover the cosmos!</h2>
        <p>Each day, NASA provides a different image or photograph of our fascinating universe, along with a brief explanation written by a professional astronomer.</p>
        <p>Below is also a fact generator. Click to see a new fact about the planetary bodies in our stellar solar system!</p>
      </article>

      <section className="facts">
        <FactGenerator />
      </section>
    </main>
  );
}

export default App;
