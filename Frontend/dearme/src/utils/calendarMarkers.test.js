import { parseISO, format } from 'date-fns';
import { getDayMarker, buildMonthGrid, getMonthAnchors } from './calendarMarkers';

// Tests build their own Dates with parseISO (local midnight) so they never
// depend on the machine's timezone.

describe('getDayMarker', () => {
    test('day inside a logged period is isPeriod, others false', () => {
        const cycles = [{ startDate: '2026-09-02', endDate: '2026-09-06' }];
        const m = getDayMarker(parseISO('2026-09-04'), {
            cycles,
            prediction: null,
            fertileWindow: null,
        });
        expect(m.isPeriod).toBe(true);
        expect(m.isPredicted).toBe(false);
        expect(m.isFertile).toBe(false);
        expect(m.isOvulation).toBe(false);
    });

    test('period range is inclusive on both edge days', () => {
        const cycles = [{ startDate: '2026-09-02', endDate: '2026-09-06' }];
        expect(getDayMarker(parseISO('2026-09-02'), { cycles }).isPeriod).toBe(true);
        expect(getDayMarker(parseISO('2026-09-06'), { cycles }).isPeriod).toBe(true);
        expect(getDayMarker(parseISO('2026-09-07'), { cycles }).isPeriod).toBe(false);
    });

    test('ovulation day returns isOvulation true AND isFertile true (overlap allowed)', () => {
        const fw = { ovulationDate: '2026-09-18', fertileStart: '2026-09-15', fertileEnd: '2026-09-19' };
        const m = getDayMarker(parseISO('2026-09-18'), {
            cycles: [],
            prediction: null,
            fertileWindow: fw,
        });
        expect(m.isOvulation).toBe(true);
        expect(m.isFertile).toBe(true);
    });

    test('fertile window edge days are inclusive; a day outside is not fertile', () => {
        const fw = { fertileStart: '2026-09-15', fertileEnd: '2026-09-19', ovulationDate: '2026-09-17' };
        expect(getDayMarker(parseISO('2026-09-15'), { fertileWindow: fw }).isFertile).toBe(true);
        expect(getDayMarker(parseISO('2026-09-19'), { fertileWindow: fw }).isFertile).toBe(true);
        expect(getDayMarker(parseISO('2026-09-20'), { fertileWindow: fw }).isFertile).toBe(false);
    });

    test('predicted next period matches only that day', () => {
        const prediction = { nextPeriodDate: '2026-10-03', averageCycleLength: 28, reliable: true };
        expect(getDayMarker(parseISO('2026-10-03'), { prediction }).isPredicted).toBe(true);
        expect(getDayMarker(parseISO('2026-10-04'), { prediction }).isPredicted).toBe(false);
    });

    test('day with no markers returns all false', () => {
        const m = getDayMarker(parseISO('2026-09-12'), {
            cycles: [],
            prediction: null,
            fertileWindow: null,
        });
        expect(m).toEqual({ isPeriod: false, isPredicted: false, isFertile: false, isOvulation: false });
    });

    test('null / invalid backend data never throws', () => {
        expect(() =>
            getDayMarker(parseISO('2026-09-10'), {
                cycles: null,
                prediction: { nextPeriodDate: null },
                fertileWindow: { ovulationDate: null, fertileStart: null, fertileEnd: null },
            })
        ).not.toThrow();

        // invalid calendar string is ignored rather than blowing up
        expect(() =>
            getDayMarker(parseISO('2026-02-01'), {
                cycles: [{ startDate: '2026-02-30', endDate: '2026-03-02' }],
            })
        ).not.toThrow();

        // missing args entirely
        expect(() => getDayMarker(parseISO('2026-09-10'))).not.toThrow();
    });
});

describe('buildMonthGrid', () => {
    test('bleeds into adjacent months, always starts Sunday and ends Saturday', () => {
        const grid = buildMonthGrid(parseISO('2026-09-10'));
        expect(grid.length).toBeGreaterThanOrEqual(35);
        expect(grid[0].getDay()).toBe(0); // Sunday
        expect(grid[grid.length - 1].getDay()).toBe(6); // Saturday
    });
});

describe('getMonthAnchors', () => {
    test('month view returns 1 anchor', () => {
        expect(getMonthAnchors(parseISO('2026-09-10'), 'month')).toHaveLength(1);
    });

    test('quarter view returns 3 consecutive month anchors', () => {
        const anchors = getMonthAnchors(parseISO('2026-09-10'), 'quarter');
        expect(anchors).toHaveLength(3);
        expect(format(anchors[0], 'yyyy-MM')).toBe('2026-09');
        expect(format(anchors[1], 'yyyy-MM')).toBe('2026-10');
        expect(format(anchors[2], 'yyyy-MM')).toBe('2026-11');
    });

    test('year view returns 12 anchors', () => {
        expect(getMonthAnchors(parseISO('2026-09-10'), 'year')).toHaveLength(12);
    });
});
