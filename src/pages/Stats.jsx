import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDetailedStats } from '../api/workouts.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

function Stats() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDetailedStats(token);
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Loading stats...</p>
            </div>
        );
    }

    if (!stats || stats.totalWorkouts === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-400">Complete a workout to see your stats.</p>
            </div>
        );
    }

    const topThree = stats.muscleGroups.slice(0, 3);
    const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd

    const podiumHeights = ['h-20', 'h-32', 'h-14'];
    const podiumLabels = ['2nd', '1st', '3rd'];

    const podiumColors = [
        'bg-black border border-gray-400',
        'bg-black border border-yellow-400',
        'bg-black border border-amber-700',
    ];
    
    const podiumTextColors = [
        'text-gray-400',
        'text-yellow-400',
        'text-amber-700',
    ];

    const radarData = stats.muscleGroups.map(mg => ({
        muscle: mg.muscle_group,
        sets: parseInt(mg.set_count)
    }));

    const formattedVolume = stats.lifetimeVolume.toLocaleString();

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <header className="bg-black border border-gray-800 px-4 py-6 text-center">
                <h1 className="text-2xl font-bold text-white tracking-widest">STATS</h1>
            </header>

            <main className="flex flex-col items-center px-4 pt-8 space-y-10">

                {/* Radar Chart */}
                <div className="w-full max-w-md">
                    <h2 className="text-gray-400 text-sm font-medium mb-4 text-center">Training Distribution</h2>
                    <div className="bg-black border border-gray-800 rounded-xl p-4" style={{ outline: 'none' }} tabIndex={-1}>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="muscle" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Radar
                                    name="Sets"
                                    dataKey="sets"
                                    stroke="#dc2626"
                                    fill="#dc2626"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Podium - Top 3 Muscle Groups */}
                {topThree.length >= 3 && (
                    <div className="w-full max-w-md">
                        <h2 className="text-gray-400 text-sm font-medium mb-4 text-center">Most Trained Muscle Groups</h2>
                        <div className="flex items-end justify-center gap-3">
                            {podiumOrder.map((idx, position) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <p className="text-white text-xs font-semibold text-center">{topThree[idx].muscle_group}</p>
                                    <p className="text-gray-400 text-xs">{topThree[idx].set_count} sets</p>
                                    <div className={`w-24 ${podiumHeights[position]} ${podiumColors[position]} rounded-t-lg flex items-center justify-center`}>
                                        <span className={`${podiumTextColors[position]} text-lg font-bold`}>{podiumLabels[position]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lifetime Volume + Total Workouts */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-black border border-gray-800 rounded-xl p-5 text-center">
                        <p className="text-gray-500 text-xs mb-1">Lifetime Volume</p>
                        <p className="text-2xl font-bold text-white">{formattedVolume}</p>
                        <p className="text-gray-500 text-xs mt-1">lbs lifted</p>
                    </div>
                    <div className="bg-black border border-gray-800 rounded-xl p-5 text-center">
                        <p className="text-gray-500 text-xs mb-1">Total Workouts</p>
                        <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
                        <p className="text-gray-500 text-xs mt-1">completed</p>
                    </div>
                </div>
                
            </main>
        </div>
    );
}

export default Stats;