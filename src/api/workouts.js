// src/api/workouts.js

const API_URL = import.meta.env.VITE_API_URL;

export const createWorkout = async (token) => {
    const now = new Date();
    const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const response = await fetch(API_URL + '/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ date: localDate })
    });
    const workoutData = await response.json();

    if (!response.ok) {
        throw new Error(workoutData.message || 'Failed to Create Workout');
    }

    return workoutData;
};

export const getWorkoutById = async (token, workout_id) => {
    const response = await fetch(`${API_URL}/workouts/${workout_id}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const workoutData = await response.json();

    if(!response.ok) {
        throw new Error(workoutData.message || 'Failed to Get Workout');
    }

    return workoutData;
};

export const updateWorkout = async (token, workout_id, notes, date, completed_at) => {
    const response = await fetch(`${API_URL}/workouts/${workout_id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes, date,completed_at })
    });
    const workoutData = await response.json();

    if(!response.ok) {
        throw new Error(workoutData.message || 'Failed to Update Workout');
    }

    return workoutData;
};

export const getWorkoutStats = async (token) => {
    const response = await fetch(`${API_URL}/workouts/stats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to get workout stats');
    }

    return data;
};

export const getWorkoutHistory = async (token) => {
    const response = await fetch(`${API_URL}/workouts/history`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to Get Workout History');
    }

    return data;
};