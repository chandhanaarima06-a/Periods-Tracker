import { useState, useEffect } from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import { useCycleApi } from './api/cycleApi';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import './CycleTracker.css';

// Nicely format a YYYY-MM-DD string for display, e.g. "Tue, Sep 15".
// parseISO (not new Date) keeps the day on LOCAL midnight so the displayed
// date never shifts in negative-offset timezones.
const fmt = (iso) => (iso ? format(parseISO(iso), 'EEE, MMM d') : '');

function CycleTracker() {
    const [selectedDate, setSelectedDate] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [fertileWindow, setFertileWindow] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);

    const { getCycles, createCycle, getPrediction, getFertileWindow } = useCycleApi();
    const { isSignedIn, user } = useUser();

    // Fetch the user's logged cycles on mount
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

    // Fetch prediction + fertile window after cycles load (raw objects, not strings)
    useEffect(() => {
        if (!loading) {
            Promise.all([getPrediction(), getFertileWindow()])
                .then(([pred, fert]) => {
                    setPrediction(pred);
                    setFertileWindow(fert);
                })
                .catch(() => {
                    setNotice('Could not load your prediction right now.');
                });
        }
    }, [loading, getPrediction, getFertileWindow]);

    function handleDateChange(event) {
        setSelectedDate(event.target.value);
    }

    async function handleLogPeriod() {
        if (selectedDate === '') {
            setNotice('Please pick a date first.');
            return;
        }

        try {
            const startDate = new Date(selectedDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 5); // Assume a 5-day period

            const newCycle = {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
            };

            const savedCycle = await createCycle(newCycle);
            setCycles((prev) => [savedCycle, ...prev]);

            // Refresh prediction + fertile window now that history changed
            const [pred, fert] = await Promise.all([getPrediction(), getFertileWindow()]);
            setPrediction(pred);
            setFertileWindow(fert);
            setNotice(null);
            setSelectedDate('');
        } catch (err) {
            setError(err.message);
            setNotice('Could not log that period. Please try again.');
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
        return <main>Loading your tracker...</main>;
    }

    const hasCycles = cycles.length > 0;
    const upcoming = prediction && prediction.nextPeriodDate;

    return (
        <main className="home">
            {/* Welcome banner */}
            <div className="home-banner">
                <span className="home-banner-emoji">🌸</span>
                <div>
                    <h1>Welcome back, {user?.firstName || 'friend'}!</h1>
                    <p>Your personal tracker and comforter.</p>
                </div>
            </div>

            {/* Log a period */}
            <div className="log-period-card">
                <h3 className="card-title">Log a period</h3>
                <div className="log-period-row">
                    <label htmlFor="period-start">Start date</label>
                    <input
                        id="period-start"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                    <button onClick={handleLogPeriod}>Log Period</button>
                </div>
                {notice && <p className="notice">{notice}</p>}
            </div>

            {error && <p className="error-message">{error}</p>}

            {/* Prediction */}
            <section className="prediction-card">
                <h3>Your next predicted period</h3>
                {upcoming ? (
                    <>
                        <p className="prediction-date">{fmt(upcoming)}</p>
                        {prediction.reliable ? (
                            <span className="badge reliable">Reliable ✓</span>
                        ) : (
                            <span className="badge estimate">Rough estimate</span>
                        )}
                        {prediction.reliable && (
                            <p className="prediction-detail">
                                Based on your average {prediction.averageCycleLength}-day cycle
                            </p>
                        )}
                    </>
                ) : hasCycles ? (
                    <p className="muted">
                        Almost there — we need one more cycle to predict. Keep logging!
                    </p>
                ) : (
                    <p className="muted">Log your first period above to get a prediction.</p>
                )}
            </section>

            {/* Fertile window */}
            {fertileWindow && fertileWindow.ovulationDate && (
                <section className="fertile-card">
                    <h3>Fertile window &amp; ovulation</h3>
                    <div className="fertile-row">
                        <span className="fertile-label">Ovulation</span>
                        <span className="fertile-value">{fmt(fertileWindow.ovulationDate)}</span>
                    </div>
                    <div className="fertile-row">
                        <span className="fertile-label">Fertile window</span>
                        <span className="fertile-value">
                            {fmt(fertileWindow.fertileStart)} → {fmt(fertileWindow.fertileEnd)}
                        </span>
                    </div>
                    <p className="disclaimer">
                        Estimates only — for wellness awareness, not medical advice or contraception.
                    </p>
                </section>
            )}

            {/* Cycle history */}
            <section className="cycle-history">
                <h3>Your logged cycles</h3>
                {!hasCycles ? (
                    <p className="muted">No periods logged yet — tap above to start!</p>
                ) : (
                    <ul>
                        {cycles.map((cycle) => (
                            <li key={cycle.id} className="cycle-item">
                                <span className="cycle-dates">
                                    📅 {fmt(cycle.startDate)} – {fmt(cycle.endDate)}
                                </span>
                                <span className="cycle-days">
                                    {differenceInCalendarDays(
                                        parseISO(cycle.endDate),
                                        parseISO(cycle.startDate)
                                    ) + 1}{' '}
                                    days
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

export default CycleTracker;