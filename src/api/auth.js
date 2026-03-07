// src/api/auth.js

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
    const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
};

export const register = async (email, password) => {
    const response = await fetch(API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data;
};

export const deleteUser = async (token) => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete account');
    return data;
};

export const changePassword = async (token, currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/auth/me/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to change password');
    return data;
};