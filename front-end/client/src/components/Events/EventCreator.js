import React, { useState } from 'react';

const EventCreator = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    price: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price
    if (eventData.price <= 0) {
      alert('Price must be a positive number.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (response.ok) {
      alert('Event created successfully!');
      setEventData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        price: '',
      });
    } else {
      const errorData = await response.json();
      alert(`Error creating event: ${errorData.msg || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={eventData.title} onChange={handleChange} placeholder="Event Title" required />
      <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
      <input type="time" name="time" value={eventData.time} onChange={handleChange} required />
      <input type="text" name="location" value={eventData.location} onChange={handleChange} placeholder="Location" required />
      <textarea name="description" value={eventData.description} onChange={handleChange} placeholder="Description" required />
      <input type="number" name="price" value={eventData.price} onChange={handleChange} placeholder="Price" required />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default EventCreator;
