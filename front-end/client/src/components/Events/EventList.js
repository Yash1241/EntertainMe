import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCreator from './EventCreator';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/events', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEvents(response.data);
            } catch (err) {
                console.error(err); // Log the error for debugging
                setError('Error fetching events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <p>Loading events...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <EventCreator />
            <h2>Event List</h2>
            <ul>
                {events.map((event) => (
                    <li key={event._id}>
                        <h3>{event.title}</h3>
                        <p>{event.description}</p>
                        <p>Date: {event.date}</p>
                        <p>Price: ${event.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
