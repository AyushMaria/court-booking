// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import './styles.css';

const App = () => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const GOOGLE_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwD_hlznCQvY51gysQtnMyRfe-EDK-16tlHvJ2Ogwj3quglrDKDHitBVPwRt-oIt4G4/exec';

  useEffect(() => {
    if (date) fetchBookedSlots(date);
  }, [date]);

  const fetchBookedSlots = async (dateToCheck) => {
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_WEB_APP_URL}?date=${dateToCheck}`);
      const data = await response.json();
      console.log('Fetched slots:', data.bookedSlots);
      setBookedSlots(data.bookedSlots || []);
    } catch (error) {
      console.error('Failed to fetch booked slots', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDisabled(true);
    const payload = { date, timeSlot, name, phone, email };

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
      setEmail('');

      setTimeout(() => {
        if (date) fetchBookedSlots(date);
        setLoading(false);
        setDisabled(false);
      }, 1500);

    } catch (error) {
      setMessage('❌ Booking failed. Please try again.');
      setLoading(false);
      setDisabled(false);
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
            disabled={disabled}
          />

          <h2 className="section-heading">Step 2: Select Time Slot</h2>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={e => setTimeSlot(e.target.value)}
            required
            className="responsive-input"
            disabled={disabled}
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
            disabled={disabled}
          />

          <input
            type="tel"
            id="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="responsive-input"
            disabled={disabled}
          />

          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="responsive-input"
            disabled={disabled}
          />

          <button type="submit" className="submit-button" disabled={disabled}>
            {loading ? '⏳ Booking...' : '📩 Book Slot'}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default App;