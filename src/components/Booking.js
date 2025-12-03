import React, { useState } from 'react';
import './Booking.css';

const Booking = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    numberOfPeople: 0,
    selectedDate: null,
    bookingType: '',
    fullName: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Booking types
  const bookingTypes = [
    'Dagspa',
    'Kvällsspa',
    'Wellness med övernattning',
    'Spa-behandlingar',
    'Yoga & Meditation',
    'Wellness-program',
    'Gruppbokning'
  ];

  const handleNumberSelect = (number) => {
    setBookingData({ ...bookingData, numberOfPeople: number });
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(year, month, day);
    setBookingData({ ...bookingData, selectedDate: selectedDate });
  };

  const handleNext = () => {
    if (step === 1 && bookingData.numberOfPeople === 0) {
      alert('Vänligen välj antal personer');
      return;
    }
    if (step === 2 && (!bookingData.selectedDate || !bookingData.bookingType)) {
      alert('Vänligen välj datum och bokningstyp');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Booking data:', bookingData);
    alert('Tack för din bokning! Vi återkommer till dig snart.');
    onClose();
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPast: true
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPast
    });
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPast: false
    });
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ];

  const weekDays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];

  return (
    <div className="booking-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <button className="booking-close" onClick={onClose}>×</button>
        
        {/* Step 1: Number of People */}
        {step === 1 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Välj antal personer</h2>
            <div className="booking-number-display">
              <span className="booking-number-value">{bookingData.numberOfPeople}</span>
              <span className="booking-number-label">personer</span>
            </div>
            <div className="booking-number-grid">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <button
                  key={number}
                  className={`booking-number-btn ${bookingData.numberOfPeople === number ? 'active' : ''}`}
                  onClick={() => handleNumberSelect(number)}
                >
                  {number}
                </button>
              ))}
            </div>
            <div className="booking-actions">
              <button className="btn btn-primary" onClick={handleNext}>
                Nästa →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date and Booking Type */}
        {step === 2 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Välj datum och paket</h2>
            <div className="booking-step2-content">
              <div className="booking-calendar">
                <div className="calendar-header">
                  <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
                  <h3 className="calendar-month">{monthNames[month]} {year}</h3>
                  <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
                </div>
                <div className="calendar-weekdays">
                  {weekDays.map((day) => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {calendarDays.map((item, index) => {
                    const isSelected = item.isCurrentMonth && 
                      bookingData.selectedDate &&
                      bookingData.selectedDate.getDate() === item.day &&
                      bookingData.selectedDate.getMonth() === month &&
                      bookingData.selectedDate.getFullYear() === year;
                    
                    return (
                      <button
                        key={index}
                        className={`calendar-day ${!item.isCurrentMonth ? 'other-month' : ''} ${item.isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => item.isCurrentMonth && !item.isPast && handleDateSelect(item.day)}
                        disabled={!item.isCurrentMonth || item.isPast}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="booking-type-section">
                <label className="booking-type-label">Välj bokningstyp</label>
                <select
                  className="booking-type-select"
                  value={bookingData.bookingType}
                  onChange={(e) => setBookingData({ ...bookingData, bookingType: e.target.value })}
                >
                  <option value="">Välj paket...</option>
                  {bookingTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="booking-actions">
              <button className="btn btn-outline" onClick={handleBack}>
                ← Tillbaka
              </button>
              <button className="btn btn-primary" onClick={handleNext}>
                Nästa →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Information Form */}
        {step === 3 && (
          <div className="booking-step">
            <h2 className="booking-step-title">Dina uppgifter</h2>
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Fullständigt namn *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={bookingData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefonnummer *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-postadress *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Anteckningar (allergier, specialkrav, etc.)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  placeholder="T.ex. allergier, specialkrav eller annan information som hotellet bör känna till..."
                />
              </div>
              <div className="booking-summary">
                <h3>Bokningssammanfattning</h3>
                <p><strong>Antal personer:</strong> {bookingData.numberOfPeople}</p>
                {bookingData.selectedDate && (
                  <p><strong>Datum:</strong> {bookingData.selectedDate.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
                {bookingData.bookingType && (
                  <p><strong>Paket:</strong> {bookingData.bookingType}</p>
                )}
              </div>
              <div className="booking-actions">
                <button type="button" className="btn btn-outline" onClick={handleBack}>
                  ← Tillbaka
                </button>
                <button type="submit" className="btn btn-primary">
                  Skicka bokning →
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;

