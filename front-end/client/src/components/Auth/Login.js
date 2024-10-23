import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Updated import
import { useUser } from './UserContext'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { setUser } = useUser();
    const token = localStorage.getItem('token');

    if (token) {
        const decoded = jwtDecode(token); // Update function call
        setUser(decoded);
        window.location.href = '/events';
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token); // Update function call
            setUser(decoded);
            setMessage('Login successful!');
            window.location.href = '/events';
        } catch (error) {
            setMessage('Error logging in: ' + (error.response?.data || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
