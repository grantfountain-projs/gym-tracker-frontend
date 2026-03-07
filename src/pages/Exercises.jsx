import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllExercises, createExercise } from '../api/exercises';

function Exercises() {
    const { token } = useAuth();
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [ascending, setAscending] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseMuscleGroup, setNewExerciseMuscleGroup] = useState('Chest');
    const [createError, setCreateError] = useState('');

    const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Forearms', 'Cardio', 'Full Body'];

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await getAllExercises();
                setExercises(data.exercises);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const handleCreateExercise = async () => {
        try {
            const newExercise = await createExercise(token, newExerciseName, newExerciseMuscleGroup);
            setExercises([...exercises, newExercise.exercise]);
            setNewExerciseName('');
            setNewExerciseMuscleGroup('Chest');
            setShowCreateForm(false);
            setCreateError('');
        } catch (error) {
            setCreateError(error.message);
        }
    };

    const filteredExercises = exercises
        .filter(e => e.name.toLowerCase().includes(searchInput.toLowerCase()))
        .sort((a, b) => {
            if (ascending) return a[sortBy] > b[sortBy] ? 1 : -1;
            return a[sortBy] < b[sortBy] ? 1 : -1;
        });

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Loading exercises...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <header className="bg-black border-b border-gray-800 px-4 py-6 text-center">
                <h1 className="text-2xl font-bold text-white tracking-widest">EXERCISES</h1>
            </header>

            <main className="px-4 pt-6 max-w-md mx-auto space-y-4">

                {/* Create form toggle */}
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                    {showCreateForm ? 'Cancel' : '+ Create Exercise'}
                </button>

                {/* Create form */}
                {showCreateForm && (
                    <div className="bg-black border border-gray-800 rounded-xl p-4 space-y-3">
                        <input
                            type="text"
                            placeholder="Exercise name..."
                            value={newExerciseName}
                            onChange={(e) => {
                                setNewExerciseName(e.target.value);
                                setCreateError('');
                            }}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <select
                            value={newExerciseMuscleGroup}
                            onChange={(e) => setNewExerciseMuscleGroup(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            {muscleGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                        {createError && <p className="text-red-400 text-sm">{createError}</p>}
                        <button
                            onClick={handleCreateExercise}
                            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
                        >
                            Create
                        </button>
                    </div>
                )}

                {/* Search and sort */}
                <div className="sticky top-0 z-10 bg-black py-2 space-y-3">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex gap-2">
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
                </div>

                {/* Exercise list */}
                <div className="space-y-2">
                    {filteredExercises.map(exercise => (
                        <div
                            key={exercise.id}
                            className="flex justify-between items-center px-4 py-3 bg-black border border-gray-800 rounded-lg"
                        >
                            <span className="text-white">{exercise.name}</span>
                            <span className="text-gray-400 text-sm">{exercise.muscle_group}</span>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}

export default Exercises;