import React, { useState, createContext, useContext } from 'react';

// Create UserContext
const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
