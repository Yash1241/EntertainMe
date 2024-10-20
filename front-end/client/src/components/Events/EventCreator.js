import React, { useState } from 'react';
import axios from 'axios';

const EventCreator = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:5000/api/events', {
                title,
                date,
                category,
                description,
                price
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Event created successfully!');
            // Clear the form after submission
            setTitle('');
            setDate('');
            setCategory('');
            setDescription('');
            setPrice('');
        } catch (error) {
            setMessage('Error creating event');
        }
    };

    return (
        <div>
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <button type="submit">Create Event</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EventCreator;
