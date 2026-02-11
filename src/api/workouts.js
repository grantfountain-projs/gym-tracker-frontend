// src/api/workouts.js

const API_URL = 'http://localhost:3000';

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

export const updateWorkout = async (token, workout_id, notes, date) => {
    const response = await fetch(`${API_URL}/workouts/${workout_id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes, date })
    });
    const workoutData = await response.json();

    if(!response.ok) {
        throw new Error(workoutData.message || 'Failed to Update Workout');
    }

    return workoutData;
};
