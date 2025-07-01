// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import './styles.css';

const App = () => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const GOOGLE_SCRIPT_WEB_APP_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!date) return;
      try {
        const response = await fetch(`${GOOGLE_SCRIPT_WEB_APP_URL}?date=${date}`);
        const data = await response.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (error) {
        console.error('Failed to fetch booked slots', error);
      }
    };
    fetchBookedSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { date, timeSlot, name, phone };

    try {
      await fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setMessage('✅ Booking submitted! If your slot was available.');
      setDate('');
      setTimeSlot('');
      setName('');
      setPhone('');
    } catch (error) {
      setMessage('❌ Booking failed. Please try again.');
    }
  };

  const renderTimeOptions = (start, end) => {
    const slots = [];
    let startHour = start;
    while (startHour < end) {
      const endHour = startHour + 1;
      const from = formatHour(startHour);
      const to = formatHour(endHour);
      const slotValue = `${from} - ${to}`;
      const isBooked = bookedSlots.includes(slotValue);
      slots.push(
        <option key={slotValue} value={slotValue} disabled={isBooked}>
          {slotValue} {isBooked ? ' (Booked)' : ''}
        </option>
      );
      startHour++;
    }
    return slots;
  };

  const formatHour = (hour) => {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${adjustedHour} ${suffix}`;
  };

  return (
    <div className="App">
      <div className="booking-container">
        <h1 className="title">Vibe&amp;Volley</h1>
        <p className="subtitle">🎾 Reserve your court slot below. Quick, easy, and free!</p>

        <form onSubmit={handleSubmit} className="booking-form">
          <h2 className="section-heading">Step 1: Choose Date</h2>
          <input
            type="date"
            id="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            className="responsive-input"
          />

          <h2 className="section-heading">Step 2: Select Time Slot</h2>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={e => setTimeSlot(e.target.value)}
            required
            className="responsive-input"
          >
            <option value="">Select Time Slot</option>
            <optgroup label="Morning (7 AM - 1 PM)">
              {renderTimeOptions(7, 13)}
            </optgroup>
            <optgroup label="Afternoon (2 PM - 5 PM)">
              {renderTimeOptions(14, 17)}
            </optgroup>
            <optgroup label="Evening (5 PM - 12 AM)">
              {renderTimeOptions(17, 24)}
            </optgroup>
          </select>

          <h2 className="section-heading">Step 3: Your Details</h2>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="responsive-input"
          />

          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="responsive-input"
          />

          <button type="submit" className="submit-button">📩 Book Slot</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default App;