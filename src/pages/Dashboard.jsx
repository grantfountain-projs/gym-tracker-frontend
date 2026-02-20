import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createWorkout, getWorkoutStats, getWorkoutHistory } from '../api/workouts.js'
import logo from '../assets/5GFLogo.png';

function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalWorkouts: 0, thisWeek: 0, streak: 0 });
    const [recentWorkouts, setRecentWorkouts] = useState([]);    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await getWorkoutStats(token);
                setStats(statsData);
                const historyData = await getWorkoutHistory(token);
                setRecentWorkouts(historyData.history.slice(0, 3));
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [token]);

    const handleStartWorkout = async () => {
        try {
            const workoutData = await createWorkout(token);
            navigate(`/active-workout/${workoutData.workout.id}`)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <header className="bg-black border-b border-gray-800 shadow-lg">
                <div className="px-4 py-3 flex flex-col justify-center items-center">
                    <img src={logo} alt="5G Fitness" className="h-28 w-auto" />
                    <p className="text-white font-bold text-lg tracking-widest">5G FITNESS</p>
                </div>
            </header>
    
            <main className="flex flex-col items-center px-4 pt-8 pb-32">
                {/* Welcome */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-1">Welcome back!</h1>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
    
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-500 text-xs mb-1">Total</p>
                        <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-500 text-xs mb-1">This Week</p>
                        <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                        <p className="text-gray-500 text-xs mb-1">Streak</p>
                        <p className="text-2xl font-bold text-red-500">{stats.streak} 🔥</p>
                    </div>
                </div>
    
                {/* Start Workout */}
                <button
                    onClick={handleStartWorkout}
                    className="w-full max-w-md bg-red-600 hover:bg-red-700 text-white font-bold text-xl py-6 rounded-xl shadow-2xl shadow-red-900/50 transition-all duration-200 active:scale-95"
                >
                    Start Workout
                </button>

                {recentWorkouts.length > 0 && (
                    <div className="w-full max-w-md mt-8">
                        <h2 className="text-gray-400 text-sm font-medium mb-3">Recent Workouts</h2>
                        <div className="space-y-2">
                            {recentWorkouts.map(workout => (
                                <div key={workout.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-medium text-sm">{workout.notes || 'Unnamed Workout'}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-400 text-xs">{workout.exercises.length} exercises</p>
                                        <p className="text-gray-500 text-xs">{workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)} sets</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                {/* Quick tip */}
                <p className="text-gray-600 text-xs mt-6">Tap the logo below to navigate</p>
            </main>
        </div>
    );
}

export default Dashboard;