import { useParams } from 'react-router-dom';

function ActiveWorkout() {
    // This hook gets the workout ID from the URL
    const { id } = useParams();

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <h1>Active Workout</h1>
            <p>Workout ID: {id}</p>
            {/* We'll build this out later */}
        </div>
    );
}

export default ActiveWorkout;