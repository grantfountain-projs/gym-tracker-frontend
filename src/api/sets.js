// src/api/sets.js

const API_URL = import.meta.env.VITE_API_URL;

export const createSet = async (token, workout_id, exercise_id, set_number, reps, weight, rpe) => {
    const response = await fetch(`${API_URL}/${workout_id}/sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ exercise_id, set_number, reps, weight, rpe })
    });
    const setData = await response.json();

    if(!response.ok) {
        throw new Error(setData.message || 'Failed to Create Set');
    }

    return setData;
};

export const getSetsByWorkoutId = async (token, workout_id) => {
    const response = await fetch(`${API_URL}/${workout_id}/sets`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`}
    });
    const setData = await response.json();

    if(!response.ok) {
        throw new Error(setData.message || 'Failed to Get Sets');
    }

    return setData;
};

export const updateSet = async (token, setID, exercise_id, set_number, reps, weight, rpe) => {
    const response = await fetch(`${API_URL}/sets/${setID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({ exercise_id, set_number, reps, weight, rpe })
    });
    const setData = await response.json();

    if(!response.ok) {
        throw new Error(setData.message || 'Failed to Update Set');
    }

    return setData;
};

export const deleteSet = async (token, setID) => {
    const response = await fetch(`${API_URL}/sets/${setID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`}
    });
    const setData = await response.json();

    if(!response.ok) {
        throw new Error(setData.message || 'Failed to Delete Set');
    }

    return setData;
};

