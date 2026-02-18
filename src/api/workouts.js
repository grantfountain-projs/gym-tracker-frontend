// src/api/workouts.js

const API_URL = 'https://gym-tracker-backend-production-a8e4.up.railway.app';

export const createWorkout = async (token) => {
    const response = await fetch(API_URL + '/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ date: new Date().toISOString() })
    });
    const workoutData = await response.json();

    if(!response.ok) {
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
