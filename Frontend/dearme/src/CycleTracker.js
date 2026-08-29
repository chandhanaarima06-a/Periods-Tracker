import { useState, useEffect } from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import { useCycleApi } from './api/cycleApi';

function CycleTracker() {
    const [selectedDate, setSelectedDate] = useState('');
    const [prediction, setPrediction] = useState('Log your period date to see your prediction here.');
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getCycles, createCycle } = useCycleApi();
    const { isSignedIn } = useUser();

    // Fetch cycles on mount
    useEffect(() => {
        async function loadCycles() {
            try {
                const data = await getCycles();
                setCycles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadCycles();
    }, [getCycles]);

    function handleDateChange(event) {
        setSelectedDate(event.target.value);
    }

    async function handleLogPeriod() {
        if (selectedDate === '') {
            setPrediction('Please select a date first!');
            return;
        }

        try {
            const startDate = new Date(selectedDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 5); // Assume 5-day period

            const newCycle = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            };

            const savedCycle = await createCycle(newCycle);
            setCycles(prev => [savedCycle, ...prev]);

            // Client-side prediction for immediate feedback
            const nextDate = new Date(startDate);
            nextDate.setDate(startDate.getDate() + 28);
            setPrediction(`Your next period is predicted on: ${nextDate.toDateString()}`);
        } catch (err) {
            setError(err.message);
            setPrediction('Failed to log period. Please try again.');
        }
    }

    if (!isSignedIn) {
        return (
            <main>
                <SignIn />
            </main>
        );
    }

    if (loading) {
        return <main>Loading...</main>;
    }

    return (
        <main>
            <h1>Welcome to DearMe</h1>
            <p>Your personal tracker and comforter.</p>

            <label>Period start Date</label>
            <input type="date" onChange={handleDateChange} />
            <button onClick={handleLogPeriod}>Log Period</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <section>
                <h3>Your Logged Cycles</h3>
                {cycles.length === 0 ? (
                    <p>No cycles logged yet.</p>
                ) : (
                    <ul>
                        {cycles.map(cycle => (
                            <li key={cycle.id}>
                                {cycle.startDate} to {cycle.endDate}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h3>Your next Predicted Period</h3>
                <p>{prediction}</p>
            </section>
        </main>
    );
}
export default CycleTracker;