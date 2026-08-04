import React from 'react';
import DatePicker from 'react-datepicker';
import './Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

function Calendar({ selectedDate, onDateSelect }) {
  const [year, month, day] = selectedDate.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);

  const handleChange = (date) => {
    if (!date || !onDateSelect) return;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    onDateSelect(`${y}-${m}-${d}`);
  };

  const handleTodayClick = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    if (onDateSelect) onDateSelect(`${y}-${m}-${d}`);
  };

  return (
    <div className="calendar-container">
      <DatePicker
        id="apod-date"
        selected={parsedDate}
        onChange={handleChange}
        dateFormat="MM-dd-yyyy"
        inline
        maxDate={new Date()}
      />
      <button className="today-button" onClick={handleTodayClick}>
        Today
      </button>
    </div>
  );
}

export default Calendar;