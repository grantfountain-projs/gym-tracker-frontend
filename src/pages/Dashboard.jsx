import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createWorkout } from '../api/workouts.js'
import logo from '../assets/5GFLogo.png';


function Dashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

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
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
                    {/* Logo */}
                    <img 
                        src={logo} 
                        alt="5G Fitness" 
                        className="h-28 w-auto"
                    />
                    
                    {/* Logout button */}
                    <button 
                        onClick={logout}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2.5 rounded-lg transition duration-200 shadow-lg shadow-red-900/30"
                    >
                        Logout
                    </button>
                </div>
            </header>
        
            {/* Main content */}
            <main className="flex flex-col items-center justify-center px-4 py-16">
                {/* Welcome section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Welcome back!
                    </h1>
                    <p className="text-gray-400 text-lg">{user?.email}</p>
                </div>

                {/* Start Workout button */}
                <button 
                    onClick={handleStartWorkout}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xl px-16 py-6 rounded-xl shadow-2xl shadow-red-900/50 transition-all duration-200 transform hover:scale-105">
                    Start Workout
                </button>

                {/* Optional: Quick stats or motivational text */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-1">Total Workouts</p>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-1">This Week</p>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center">
                        <p className="text-gray-400 text-sm mb-1">Current Streak</p>
                        <p className="text-3xl font-bold text-white">0</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;