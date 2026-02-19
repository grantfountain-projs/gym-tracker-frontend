import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkoutById, updateWorkout } from '../api/workouts';
import { getAllExercises, createExercise } from '../api/exercises';
import { getSetsByWorkoutId, createSet, updateSet, deleteSet } from '../api/sets';
// import logo from '../assets/5GFLogo.png';



function ActiveWorkout() {
    const [workout, setWorkout] = useState(null);
    const [sets, setSets] = useState([]);           // grows as user adds sets
    const [exercises, setExercises] = useState([]); // loaded from API
    const [timerRunning, setTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // updates every second
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [workoutName, setWorkoutName] = useState('');

    const [pendingExercises, setPendingExercises] = useState([]);
    const [showExerciseSelector, setShowExerciseSelector] = useState(false);
    const [showCreateExercise, setShowCreateExercise] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name' or 'muscle_group'
    const [ascending, setAscending] = useState(true);

    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseMuscleGroup, setNewExerciseMuscleGroup] = useState('Chest');
    const [createExerciseError, setCreateExerciseError] = useState('');

    const [addingSetForExercise, setAddingSetForExercise] = useState(null);
    const [newReps, setNewReps] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [newRpe, setNewRpe] = useState(5);
    const [editingSetId, setEditingSetId] = useState(null);
    const [editReps, setEditReps] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [editRpe, setEditRpe] = useState(5);

    const [showSummary, setShowSummary] = useState(false);

    // This hook gets the workout ID from the URL
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate(); 
    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Forearms', 'Cardio', 'Full Body'];
    

    useEffect(() => {
        // This runs once when component mounts
        const fetchData = async () => {
            try {
                const workoutData = await getWorkoutById(token, id);
                setWorkout(workoutData.workout); 
                const exerciseData = await getAllExercises();
                setExercises(exerciseData.exercises);
                const setData = await getSetsByWorkoutId(token, id);
                setSets(setData.sets);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id, token]);

    useEffect(() => {
        if (!timerRunning) return;
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [timerRunning]);

    const totalVolume = sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleNameClick = () => {
        setIsEditingName(true);
        setWorkoutName(workout?.notes || '');
    };

    const handleNameSave = async () => {
        try {
            const workoutData = await updateWorkout(token, id, workoutName, workout.date);
            setWorkout(workoutData.workout);
        } catch (error) {
            console.error(error);
        } finally {
            setIsEditingName(false);
        }
    };

    const handleSelectExercise = (exercise) => {
        const isInPendingExercises = pendingExercises.find(e => e.id === exercise.id);
        if (!isInPendingExercises) {
            setPendingExercises([...pendingExercises, exercise]);
        }
        setShowExerciseSelector(false);
    }

    const handleCreateExercise = async () => {
        try {
            const newExercise = await createExercise(token, newExerciseName, newExerciseMuscleGroup);
            setExercises([...exercises, newExercise.exercise]);
            setPendingExercises([...pendingExercises, newExercise.exercise]);
            setNewExerciseName('');
            setNewExerciseMuscleGroup('Chest');
            setShowCreateExercise(false);
            setShowExerciseSelector(false);
        } catch (error) {
            setCreateExerciseError(error.message);
        }
    };

    

    const handleAddSet = async (exerciseId) => {
        const existingSets = sets.filter(set => set.exercise_id === exerciseId);
        const setNumber = existingSets.length + 1;
        try {
            const newSet = await createSet(token, id, exerciseId, setNumber, newReps, newWeight, newRpe);
            setSets([...sets, newSet.set]);
            setNewReps('');
            setNewWeight('');
            setNewRpe(5);
            setAddingSetForExercise(null)
        } catch (error) {
            console.error(error);
        }
        
    };

    const handleEditClick = (set) => {
        setEditingSetId(set.id);
        setEditReps(set.reps);
        setEditWeight(set.weight);
        setEditRpe(set.rpe);
    };

    const handleSaveSet = async (set) => {
        try {
            const updatedSet = await updateSet(token, set.id, set.exercise_id, set.set_number, editReps, editWeight, editRpe);
            setSets(sets.map(s => s.id === set.id ? updatedSet.set : s));
            setEditReps('');
            setEditWeight('');
            setEditRpe(5);
            setEditingSetId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteExercise = async (exerciseId) => {
        try {
            // Delete all sets for this exercise from DB
            const exerciseSets = sets.filter(s => s.exercise_id === exerciseId);
            await Promise.all(exerciseSets.map(s => deleteSet(token, s.id)));
            
            // Then clear from state
            setPendingExercises(pendingExercises.filter(e => e.id !== exerciseId));
            setSets(sets.filter(s => s.exercise_id !== exerciseId));
        } catch (error) {
            console.error(error);
        }
    };
    const handleDeleteSet = async (setId, exerciseId) => {
        try {
            await deleteSet(token, setId);
            const remaining = sets.filter(s => s.id !== setId);
            
            // Renumber sets for that exercise
            /**
             * this renumbers client-side only
             * the DB still has old set numbers but that's fine since set_number is just a display value and gets recalculated on add anyway.
             */
            const renumbered = remaining.map(s => {
                if (s.exercise_id !== exerciseId) return s;
                const newNumber = remaining
                    .filter(r => r.exercise_id === exerciseId)
                    .sort((a, b) => a.set_number - b.set_number)
                    .findIndex(r => r.id === s.id) + 1;
                return { ...s, set_number: newNumber };
            });
            
            setSets(renumbered);
        } catch (error) {
            console.error(error);
        }
    };


    const handleEndWorkout = async () => {
        try {
            const completedAt = new Date().toISOString();
            const endedWorkout = await updateWorkout(token, id, workout.notes, workout.date, completedAt);
            setWorkout(endedWorkout.workout);
            setShowSummary(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDuplicateSet = async (set) => {
        const existingSets = sets.filter(s => s.exercise_id === set.exercise_id);
        const setNumber = existingSets.length + 1;
        try {
            const newSet = await createSet(token, id, set.exercise_id, setNumber, set.reps, set.weight, set.rpe);
            setSets([...sets, newSet.set]);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredExercises = exercises.filter(exercise => exercise.name.toLowerCase().includes(searchInput.toLowerCase()))
    .sort((a, b) => {
        // compare a and b by sortBy field
        if (ascending) {
            return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading workout...</div>
            </div>
        );
    }

    if (showSummary) {
        const uniqueMuscleGroups = [...new Set(pendingExercises.map(ex => ex.muscle_group))];
        const uniqueExercises = [...new Set(sets.map(set => set.exercise_id))];
        const totalSets = sets.length;
        
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                {/* Workout Complete Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-red-600 mb-2">Workout Complete!</h1>
                    <p className="text-2xl text-white font-semibold">{workout?.notes || "Unnamed Workout"}</p>
                </div>

                {/* Stats Grid */}
                <div className="w-full max-w-md bg-black rounded-lg border border-red-600 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white font-semibold text-xl">{formatTime(elapsedTime)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Total Volume</span>
                        <span className="text-white font-semibold text-xl">{totalVolume} lbs</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Exercises</span>
                        <span className="text-white font-semibold text-xl">{uniqueExercises.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                        <span className="text-gray-400">Total Sets</span>
                        <span className="text-white font-semibold text-xl">{totalSets}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Muscle Groups</span>
                        <span className="text-white font-semibold text-xl">{uniqueMuscleGroups.join(', ')}</span>
                    </div>
                </div>

                {/* Home Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
                >
                    Back to Home
                </button>
            </div>
        );
    }
    
    // If not loading, show the actual content
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header section */}
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg p-4">
            {/* Top row: Logo and Workout Name */}
            <div className="flex justify-center items-center mb-4">
                {isEditingName ? (
                    <input 
                        type="text"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        onBlur={handleNameSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleNameSave();
                            }
                        }}
                        autoFocus
                        className="text-2xl font-bold bg-gray-700 text-white px-2 py-1 rounded text-center"
                    />
                ) : (
                    <h1 
                        onClick={handleNameClick}
                        className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300"
                    >
                        {workout?.notes || "Unnamed Workout"}
                    </h1>
                )}
            </div>
            
            {/* Bottom row: Time and Volume */}
            <div className="flex justify-around gap-6 items-center">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-2xl font-semibold">{formatTime(elapsedTime)}</p>
                </div>
                <div className="flex gap-2">
                    {!timerRunning ? (
                        <button
                            onClick={() => setTimerRunning(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg"
                        >
                            Start
                        </button>
                    ) : (
                        <button
                            onClick={() => setTimerRunning(false)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold rounded-lg"
                        >
                            Pause
                        </button>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Volume</p>
                    <p className="text-2xl font-semibold">{totalVolume} lbs</p>
                </div>
            </div>
            </header>
            {/* Exercise selector */}
            <div className="p-4">
                {/* Add Exercise Button */}
                <button
                    onClick={() => setShowExerciseSelector(!showExerciseSelector)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                    {showExerciseSelector ? 'Cancel' : '+ Add Exercise'}
                </button>

                {/* Dropdown */}
                {showExerciseSelector && (
                    <div className="mt-2 bg-gray-800 rounded-lg border border-gray-700 p-4">
                        {showCreateExercise ? (
                            // CREATE FORM
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Exercise name..."
                                    value={newExerciseName}
                                    onChange={(e) => {
                                        setNewExerciseName(e.target.value);
                                        setCreateExerciseError('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <select
                                    value={newExerciseMuscleGroup}
                                    onChange={(e) => setNewExerciseMuscleGroup(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {muscleGroups.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                                {createExerciseError && (
                                    <p className="text-red-400 text-sm">{createExerciseError}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowCreateExercise(false)}
                                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleCreateExercise}
                                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Search input */}
                                <input
                                    type="text"
                                    placeholder="Search exercises..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                                />

                                {/* Sort controls */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={() => setSortBy('name')}
                                        className={`px-3 py-1 rounded text-sm font-medium ${sortBy === 'name' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                    >
                                        Name
                                    </button>
                                    <button
                                        onClick={() => setSortBy('muscle_group')}
                                        className={`px-3 py-1 rounded text-sm font-medium ${sortBy === 'muscle_group' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                                    >
                                        Muscle Group
                                    </button>
                                    <button
                                        onClick={() => setAscending(!ascending)}
                                        className="px-3 py-1 rounded text-sm font-medium bg-gray-700 text-gray-300 ml-auto"
                                    >
                                        {ascending ? '↑ Asc' : '↓ Desc'}
                                    </button>
                                </div>

                                {/* Exercise list */}
                                <div className="max-h-64 overflow-y-auto space-y-1">
                                    {filteredExercises.map(exercise => (
                                        <div
                                            key={exercise.id}
                                            onClick={() => handleSelectExercise(exercise)}
                                            className="flex justify-between items-center px-3 py-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                                        >
                                            <span className="text-white">{exercise.name}</span>
                                            <span className="text-gray-400 text-sm">{exercise.muscle_group}</span>
                                        </div>
                                    ))}

                                        
                                </div>
                                {/* Create New Exercise option */}
                                <div
                                        onClick={() => setShowCreateExercise(true)}
                                        className="w-full flex items-center justify-center px-3 py-2 mt-2 rounded-lg border border-dashed border-red-500/50 hover:border-red-500 hover:bg-red-500/10 cursor-pointer transition duration-200"
                                    >
                                        <span className="text-red-500 font-medium">+ Create New Exercise</span>
                                </div>
                                    </>
                                )}
                    </div>
                )}
                
            </div>
            {/* Sets display */}
            {/* Exercise Cards */}
            <div className="p-4 space-y-4 pb-32">
                {pendingExercises.map(exercise => (
                    <div key={exercise.id} className="relative border border-red-600 rounded-xl p-4 pt-8">
                        <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Title bar - overlaps the top border */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-3 whitespace-nowrap text-center">
                            <p className="text-white font-bold text-sm">{exercise.name}</p>
                            <p className="text-gray-400 text-xs">Muscle Group: {exercise.muscle_group}</p>
                        </div>

                        {/* Card content */}
                        <div className="mt-2 space-y-2">
                            {sets.filter(set => set.exercise_id === exercise.id).length === 0 ? (
                                <p className="text-gray-400 text-center text-sm">No sets logged yet</p>
                            ) : (
                                sets.filter(set => set.exercise_id === exercise.id).map(set => (
                                    <div key={set.id} className="flex justify-between items-center px-2 py-1">
                                        {editingSetId === set.id ? (
                                            // Edit form
                                            <div className="w-full">
                                                <div className="space-y-3 my-2">
                                                    <div className="space-y-1">
                                                        <label className="text-gray-400 text-sm">Reps</label>
                                                        <input
                                                            type="number"
                                                            value={editReps}
                                                            onChange={(e) => setEditReps(e.target.value)}
                                                            placeholder="10"
                                                            min="0"
                                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-gray-400 text-sm">Weight (lbs)</label>
                                                        <input
                                                            type="number"
                                                            value={editWeight}
                                                            onChange={(e) => setEditWeight(e.target.value)}
                                                            placeholder="135"
                                                            min="0"
                                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-gray-400 text-sm">Rate of Perceived Exertion (RPE) 1-10</label>
                                                        <input
                                                            type="number"
                                                            value={editRpe}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === '') { setEditRpe(''); return; }
                                                                const num = parseInt(val);
                                                                if (!isNaN(num)) setEditRpe(Math.min(10, Math.max(1, num)));
                                                            }}
                                                            min="1"
                                                            max="10"
                                                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingSetId(null)}
                                                            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveSet(set)}
                                                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Normal set row
                                            <div className="grid grid-cols-4 items-center px-2 py-2 gap-2 w-full border-b border-red-600/40">
                                                <span className="text-gray-400 text-sm">#{set.set_number}</span>
                                                <span className="text-white text-sm col-span-2 whitespace-nowrap">{set.weight} lbs x {set.reps} reps</span>
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleDuplicateSet(set)} className="p-1">
                                                        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleEditClick(set)} className="p-1">
                                                        <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteSet(set.id, set.exercise_id)} className="p-1">
                                                        <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Set button */}
                        {addingSetForExercise === exercise.id ? (
                            // Show the set input form
                            <div className="space-y-3 mt-3">
                                <div className="space-y-1">
                                    <label className="text-gray-400 text-sm">Reps</label>
                                    <input
                                        type="number"
                                        value={newReps}
                                        onChange={(e) => setNewReps(e.target.value)}
                                        placeholder="10"
                                        min="0"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-gray-400 text-sm">Weight (lbs)</label>
                                    <input
                                        type="number"
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                        placeholder="135"
                                        min="0"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-gray-400 text-sm">Rate of Perceived Exertion (RPE) 1-10</label>
                                    <input
                                        type="number"
                                        value={newRpe}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') { setNewRpe(''); return; }
                                            const num = parseInt(val);
                                            if (!isNaN(num)) setNewRpe(Math.min(10, Math.max(1, num)));
                                        }}
                                        min="1"
                                        max="10"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAddingSetForExercise(null)}
                                        className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAddSet(exercise.id)}
                                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                                    >
                                        Log Set
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Show the + Add Set button
                            <button 
                                onClick={() => setAddingSetForExercise(exercise.id)}
                                className="w-full mt-3 py-2 border border-dashed border-red-600/50 hover:border-red-600 hover:bg-red-600/10 text-red-500 rounded-lg transition duration-200"
                            >
                                + Add Set
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {/* End Workout Button */}
            <div className="fixed bottom-4 left-4 right-4">
                <button
                    onClick={handleEndWorkout}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200 border border-gray-600"
                >
                    End Workout
                </button>
            </div>
        </div>
    );
}

export default ActiveWorkout;