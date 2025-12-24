import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On page load, check if JWT exists
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('userData');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); // Finished loading
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    };

    return (
        <UserContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};