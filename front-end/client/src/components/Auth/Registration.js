import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/events'; // Redirect logged-in users to events page
        return null;
    }

    // Email validation function
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Optional: Password validation for strength (at least 6 characters)
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setMessage('Invalid email format.');
            return;
        }

        if (!validatePassword(password)) {
            setMessage('Password should be at least 6 characters long.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/users/register', {
                name,
                email,
                password,
            });
            setMessage('User registered successfully!');
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            setMessage('Error registering user');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Registration;
