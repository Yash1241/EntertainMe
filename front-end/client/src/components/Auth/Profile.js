import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5002/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Invalid or expired token, redirect to login
                    localStorage.removeItem('token'); // Clear token
                    window.location.href = '/login'; // Redirect to login
                } else {
                    console.error('Error fetching user data', error);
                }
            }
        };

        fetchUser();
    }, []);

    if (!user) {
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h2>User Profile</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default Profile;
