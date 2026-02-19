// src/pages/History.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

// Helpers
const fetchHistory = async (token) => {
    const res = await fetch(`${API_URL}/workouts/history`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch history");
    return data.history;
};

const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }) + " · " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getWeekKey = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDay(); // 0 = Sunday
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));
    return monday.toISOString().split("T")[0]; // "YYYY-MM-DD" of that week's Monday
};

const formatWeekLabel = (weekKey) => {
    const monday = new Date(weekKey + "T00:00:00");
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const thisWeekKey = getWeekKey(new Date().toISOString());
    if (weekKey === thisWeekKey) return "This Week";

    return monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        + " – "
        + sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const calcVolume = (exercises) => {
    let total = 0;
    for (const ex of exercises) {
        for (const set of ex.sets) {
            total += parseFloat(set.weight) * set.reps;
        }
    }
    return total.toLocaleString();
};

const calcTotalSets = (exercises) => {
    return exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
};

// Sub-components
const SetRow = ({ set }) => (
    <div className="grid grid-cols-4 gap-2 text-sm py-1 border-b border-gray-800 last:border-0">
        <span className="text-gray-500">Set {set.set_number}</span>
        <span className="text-white">{set.reps} reps</span>
        <span className="text-white">{parseFloat(set.weight)} lbs</span>
        <span className="text-gray-400">RPE {set.rpe}</span>
    </div>
);

const ExerciseBlock = ({ exercise }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">{exercise.name}</span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                {exercise.muscle_group}
            </span>
        </div>
        <div className="pl-2">
            {exercise.sets.map((set) => (
                <SetRow key={set.id} set={set} />
            ))}
        </div>
    </div>
);

const WorkoutCard = ({ workout }) => {
    const [expanded, setExpanded] = useState(false);
    const totalSets = calcTotalSets(workout.exercises);
    const volume = calcVolume(workout.exercises);

    return (
        <div className="border border-red-600 rounded-lg overflow-hidden mb-3">
            {/* Card Header — always visible */}
            <button
                onClick={() => setExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between p-4 bg-black hover:bg-gray-900 transition-colors"
            >
                <div className="text-left">
                    <p className="text-white font-semibold text-sm">
                        {formatDateTime(workout.completed_at)}
                    </p>
                    {workout.notes && (
                        <p className="text-gray-400 text-xs mt-0.5">{workout.notes}</p>
                    )}
                </div>
                <div className="flex items-center gap-4 text-right">
                    <div className="text-xs text-gray-400 hidden sm:block">
                        <span className="text-white font-semibold">{workout.exercises.length}</span> exercises
                        &nbsp;·&nbsp;
                        <span className="text-white font-semibold">{totalSets}</span> sets
                        &nbsp;·&nbsp;
                        <span className="text-white font-semibold">{volume}</span> lbs
                    </div>
                    <span className="text-red-500 text-lg">{expanded ? "▲" : "▼"}</span>
                </div>
            </button>

            {/* Mobile summary (hidden on sm+) */}
            <div className="sm:hidden px-4 pb-2 bg-black flex gap-3 text-xs text-gray-400">
                <span><span className="text-white font-semibold">{workout.exercises.length}</span> exercises</span>
                <span><span className="text-white font-semibold">{totalSets}</span> sets</span>
                <span><span className="text-white font-semibold">{volume}</span> lbs</span>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="p-4 bg-gray-950 border-t border-gray-800">
                    {workout.exercises.map((ex) => (
                        <ExerciseBlock key={ex.id} exercise={ex} />
                    ))}
                </div>
            )}
        </div>
    );
};

const WeekSection = ({ weekKey, workouts, defaultOpen }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="mb-6">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex justify-between items-center mb-3"
            >
                <h2 className="text-red-500 font-bold text-lg">{formatWeekLabel(weekKey)}</h2>
                <span className="text-gray-500 text-sm">{open ? "collapse ▲" : "expand ▼"}</span>
            </button>
            {open && workouts.map((w) => <WorkoutCard key={w.id} workout={w} />)}
        </div>
    );
};

// Main Component
export default function History() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory(token)
            .then(setHistory)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    // Group workouts by week
    const weekMap = new Map();
    for (const workout of history) {
        const key = getWeekKey(workout.completed_at);
        if (!weekMap.has(key)) weekMap.set(key, []);
        weekMap.get(key).push(workout);
    }

    const thisWeekKey = getWeekKey(new Date().toISOString());

    return (
        <div className="min-h-screen bg-black text-white p-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-2xl">
                    ←
                </button>
                <h1 className="text-3xl font-bold text-red-600">History</h1>
            </div>

            {loading && <p className="text-gray-400 text-center mt-20">Loading...</p>}
            {error && <p className="text-red-500 text-center mt-20">{error}</p>}

            {!loading && !error && weekMap.size === 0 && (
                <p className="text-gray-400 text-center mt-20">No completed workouts yet.</p>
            )}

            {!loading && !error && Array.from(weekMap.entries()).map(([weekKey, workouts]) => (
                <WeekSection
                    key={weekKey}
                    weekKey={weekKey}
                    workouts={workouts}
                    defaultOpen={weekKey === thisWeekKey}
                />
            ))}
        </div>
    );
}