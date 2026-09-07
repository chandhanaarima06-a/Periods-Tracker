// Pure date-marker logic for the DearMe calendar.
// No React, no fetch — every backend date string (YYYY-MM-DD) is parsed with
// date-fns `parseISO` so it lands on LOCAL midnight. (`new Date("2026-09-07")`
// would parse as UTC midnight and shift the day in some timezones.)
//
// Keeping all timezone-sensitive logic here, in one audited place, means the
// component never touches raw Date parsing — and this module is unit-testable
// with plain Jest because it has zero React/Clerk imports.

import {
    parseISO,
    isValid,
    isSameDay,
    isWithinInterval,
    startOfMonth,
    startOfWeek,
    endOfMonth,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
} from 'date-fns';

// Parse a YYYY-MM-DD string into a local-midnight Date, or null if falsy/invalid.
// Every public function routes its strings through this guard so `parseISO(null)`
// (which produces Invalid Date) can never escape.
function safeParse(str) {
    if (!str) return null;
    const date = parseISO(str);
    return isValid(date) ? date : null;
}

// True if `date` falls anywhere inside any logged period range (inclusive).
function isDateInAnyPeriod(date, cycles) {
    const list = Array.isArray(cycles) ? cycles : [];
    for (const cycle of list) {
        const start = safeParse(cycle.startDate);
        const end = safeParse(cycle.endDate);
        if (start && end && isWithinInterval(date, { start, end })) {
            return true;
        }
    }
    return false;
}

// Returns which semantic markers apply to a single calendar day.
//
// Returns booleans rather than a single "kind" because one day can legitimately
// carry several markers (ovulation sits inside the fertile window; a very short
// cycle can overlap a logged period). The component applies multiple CSS classes
// and the stylesheet defines the visual stacking order.
//
//   cycles:        [{ startDate, endDate }, ...]  (from GET /v1/cycles)
//   prediction:    { nextPeriodDate, ... } | null (from GET /v1/cycles/prediction)
//   fertileWindow: { ovulationDate, fertileStart, fertileEnd, ... } | null
//
// Every input may be null/undefined/all-null — this function never throws.
export function getDayMarker(date, { cycles, prediction, fertileWindow } = {}) {
    const isPeriod = isDateInAnyPeriod(date, cycles);

    const predictedDate = safeParse(prediction && prediction.nextPeriodDate);
    const isPredicted = !!predictedDate && isSameDay(date, predictedDate);

    const fertileStart = safeParse(fertileWindow && fertileWindow.fertileStart);
    const fertileEnd = safeParse(fertileWindow && fertileWindow.fertileEnd);
    const isFertile =
        !!fertileStart &&
        !!fertileEnd &&
        isWithinInterval(date, { start: fertileStart, end: fertileEnd });

    const ovulationDate = safeParse(fertileWindow && fertileWindow.ovulationDate);
    const isOvulation = !!ovulationDate && isSameDay(date, ovulationDate);

    return { isPeriod, isPredicted, isFertile, isOvulation };
}

// The 35 or 42 days that fill a month grid: it starts on the Sunday on/before
// the 1st and ends on the Saturday on/after the last day, so it intentionally
// bleeds into adjacent months (the caller renders those cells muted).
//
// `weekStartsOn: 0` is explicit so a locale/contributor change can't silently
// flip the grid to Monday-start and misalign the "Sun..Sat" header.
export function buildMonthGrid(monthAnchor) {
    const monthStart = startOfMonth(monthAnchor);
    const monthEnd = endOfMonth(monthAnchor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

// Month anchors for the current view: 1 for month, 3 for quarter, 12 for year.
// Each anchor is any Date inside its month — buildMonthGrid normalizes it.
export function getMonthAnchors(viewDate, viewMode) {
    const count = viewMode === 'quarter' ? 3 : viewMode === 'year' ? 12 : 1;
    return Array.from({ length: count }, (_, i) => addMonths(viewDate, i));
}
