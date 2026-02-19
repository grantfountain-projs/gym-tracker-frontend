import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/auth';
/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        const data = await apiLogin(email, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (email, password) => {
        const data = await apiRegister(email, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const validateToken = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) {
                    // Token is expired or invalid
                    logout();
                }
            } catch {
                logout();
            }
        };
        validateToken();
    }, [token]); // runs once on app load

    const value = {
        user,
        token,
        login,
        logout,
        register
    };
      
    return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
    );

}


export const useAuth = () => {
    return useContext(AuthContext);
}