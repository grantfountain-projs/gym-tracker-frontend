import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWorkoutById, updateWorkout } from '../api/workouts';
import { getAllExercises, createExercise } from '../api/exercises';
import { getSetsByWorkoutId, createSet, updateSet, deleteSet } from '../api/sets';
import logo from '../assets/5GFLogo.png';



function ActiveWorkout() {
    const [workout, setWorkout] = useState(null);
    const [sets, setSets] = useState([]);           // grows as user adds sets
    const [exercises, setExercises] = useState([]); // loaded from API
    const [selectedExercise, setSelectedExercise] = useState(null); // user selection
    const [elapsedTime, setElapsedTime] = useState(0); // updates every second
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [workoutName, setWorkoutName] = useState('');

    // This hook gets the workout ID from the URL
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate(); 
    

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
    }, []);

    useEffect(() => {
        if (!workout) return;
        
        const interval = setInterval(() => {
            const currentTime = new Date();
            const initialWorkoutTime = new Date(workout.created_at);
            setElapsedTime(currentTime - initialWorkoutTime);
        }, 1000);
        
        return () => clearInterval(interval);
    }, [workout]);

    const totalVolume = sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading workout...</div>
            </div>
        );
    }
    
    // If not loading, show the actual content
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header section */}
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg p-4">
            {/* Top row: Logo and Workout Name */}
            <div className="flex justify-between items-center mb-4">
                <img 
                    src={logo} 
                    alt="5G Fitness" 
                    className="h-24 w-auto"
                />
                {isEditingName ? (
                <input 
                    type="text"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    onBlur={handleNameSave}  // Save when clicking away
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleNameSave();
                        }
                    }}
                    autoFocus
                    className="text-2xl font-bold bg-gray-700 text-white px-2 py-1 rounded"
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
            <div className="flex justify-around gap-6">
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-2xl font-semibold">{formatTime(elapsedTime)}</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-400 text-sm">Volume</p>
                    <p className="text-2xl font-semibold">{totalVolume} lbs</p>
                </div>
            </div>
        </header>
            {/* Exercise selector */}
            {/* Sets display */}
        </div>
    );
}

export default ActiveWorkout;