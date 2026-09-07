import { useState, useEffect } from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import { useCycleApi } from './api/cycleApi';
import { format, addMonths, subMonths, isSameMonth, isToday, startOfMonth } from 'date-fns';
import { getDayMarker, buildMonthGrid, getMonthAnchors } from './utils/calendarMarkers';
import './Calendar.css';

// MonthGrid: renders one month's weekday header + grid of day cells.
// Reused 1x (month), 3x (quarter), or 12x (year) — DRY.
function MonthGrid({ monthAnchor, data, compact, showLabel }) {
    const { cycles, prediction, fertileWindow } = data;
    const gridDays = buildMonthGrid(monthAnchor);

    return (
        <div className="calendar-month">
            {showLabel && (
                <h3 className="calendar-month-title">
                    {format(monthAnchor, 'MMMM yyyy')}
                </h3>
            )}

            <div className="calendar-weekday-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (w) => (
                        <div key={w}>{w}</div>
                    )
                )}
            </div>

            <div className={compact ? 'calendar-grid compact' : 'calendar-grid'}>
                {gridDays.map((day) => {
                    const marker = getDayMarker(day, {
                        cycles,
                        prediction,
                        fertileWindow,
                    });

                    const classes = ['calendar-day'];
                    if (marker.isPeriod) classes.push('calendar-day--period');
                    if (marker.isPredicted)
                        classes.push('calendar-day--predicted');
                    if (marker.isFertile) classes.push('calendar-day--fertile');
                    if (marker.isOvulation)
                        classes.push('calendar-day--ovulation');
                    if (!isSameMonth(day, monthAnchor))
                        classes.push('calendar-day--outside-month');
                    if (isToday(day)) classes.push('calendar-day--today');

                    return (
                        <div
                            key={format(day, 'yyyy-MM-dd')}
                            className={classes.join(' ')}
                        >
                            <span className="calendar-day-number">
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Calendar() {
    const [viewMode, setViewMode] = useState('month');
    const [viewDate, setViewDate] = useState(new Date());
    const [cycles, setCycles] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [fertileWindow, setFertileWindow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getCycles, getPrediction, getFertileWindow } = useCycleApi();
    const { isSignedIn } = useUser();

    // Fetch all calendar data on mount (3 endpoints in parallel)
    useEffect(() => {
        if (!isSignedIn) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function loadData() {
            try {
                const [cyclesData, predictionData, fertileData] =
                    await Promise.all([
                        getCycles(),
                        getPrediction(),
                        getFertileWindow(),
                    ]);

                if (!cancelled) {
                    setCycles(cyclesData);
                    setPrediction(predictionData);
                    setFertileWindow(fertileData);
                }
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadData();
        return () => {
            cancelled = true;
        };
    }, [isSignedIn, getCycles, getPrediction, getFertileWindow]);

    // --- Navigation logic ---
    const step =
        viewMode === 'quarter' ? 3 : viewMode === 'year' ? 12 : 1;
    const handlePrev = () => setViewDate((d) => subMonths(d, step));
    const handleNext = () => setViewDate((d) => addMonths(d, step));
    const handleToday = () => setViewDate(new Date());

    // --- Header label ---
    const getHeaderLabel = () => {
        if (viewMode === 'month') {
            return format(viewDate, 'MMMM yyyy');
        }
        if (viewMode === 'quarter') {
            const qStart = startOfMonth(viewDate);
            const qEnd = addMonths(viewDate, 2);
            return `${format(qStart, 'MMM')} – ${format(qEnd, 'MMM yyyy')}`;
        }
        return format(viewDate, 'yyyy');
    };

    // --- Auth / loading gates ---
    if (!isSignedIn) {
        return (
            <main>
                <SignIn />
            </main>
        );
    }

    if (loading) {
        return <main>Loading calendar...</main>;
    }

    if (error) {
        return (
            <main>
                <p style={{ color: 'var(--rose-deep)' }}>{error}</p>
            </main>
        );
    }

    // --- Calendar data ---
    const months = getMonthAnchors(viewDate, viewMode);

    return (
        <main className="calendar-container">
            {/* View selector */}
            <div className="calendar-view-selector">
                {[
                    { label: 'Month', mode: 'month' },
                    { label: '3 Months', mode: 'quarter' },
                    { label: 'Year', mode: 'year' },
                ].map(({ label, mode }) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={
                            viewMode === mode ? 'active' : ''
                        }
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Navigation header */}
            <div className="calendar-header">
                <button onClick={handlePrev}>‹ Prev</button>
                <h2>{getHeaderLabel()}</h2>
                <button onClick={handleNext}>Next ›</button>
                <button onClick={handleToday}>Today</button>
            </div>

            {/* Grid(s) */}
            <div
                className={
                    'calendar-view calendar-view--' + viewMode
                }
            >
                {months.map((m) => (
                    <MonthGrid
                        key={format(m, 'yyyy-MM')}
                        monthAnchor={m}
                        data={{ cycles, prediction, fertileWindow }}
                        showLabel={viewMode !== 'month'}
                        compact={viewMode === 'year'}
                    />
                ))}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
                {[
                    { label: 'Period', color: 'period' },
                    { label: 'Predicted', color: 'predicted' },
                    { label: 'Fertile window', color: 'fertile' },
                    { label: 'Ovulation', color: 'ovulation' },
                    { label: 'Today', color: 'today' },
                ].map(({ label, color }) => (
                    <div key={color} className="calendar-legend-item">
                        <span
                            className={
                                'calendar-legend-swatch ' + color
                            }
                        />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Calendar;
