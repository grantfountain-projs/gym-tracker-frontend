// src/api/exercises.js

const API_URL = 'https://gym-tracker-backend-production-a8e4.up.railway.app';

export const createExercise = async (token, name, muscle_group) => {
    const response = await fetch(API_URL + '/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ name, muscle_group})
    });
    const exerciseData = await response.json();

    if(!response.ok) {
        throw new Error(exerciseData.message || 'Failed to Create Exercise');
    }

    return exerciseData;
};

export const getAllExercises = async () => {
    const response = await fetch(API_URL + '/exercises', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'}
    });
    const exerciseData = await response.json();

    if(!response.ok) {
        throw new Error(exerciseData.message || 'Failed to Get Exercises');
    }

    return exerciseData;
};

