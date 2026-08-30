package com.dearme.backend.service;

import com.dearme.backend.dto.PredictionResponse;
import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.repository.CycleEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class PredictionService {

    private static final int DEFAULT_CYCLE_LENGTH = 28;
    private static final int MIN_CYCLES_FOR_RELIABLE = 2;

    private final CycleEntryRepository cycleEntryRepository;

    public PredictionService(CycleEntryRepository cycleEntryRepository) {
        this.cycleEntryRepository = cycleEntryRepository;
    }

    public PredictionResponse getPredictionForUser(String userId) {
        // 1. Get the user's cycles, oldest to newest
        List<CycleEntry> cycles = cycleEntryRepository.findByUserIdOrderByStartDateAsc(userId);

        if (cycles.isEmpty()) {
            return new PredictionResponse(null, null, 0, false);
        }

        // 2. Compute cycle length between each pair of consecutive periods
        int totalDays = 0;
        int intervals = cycles.size() - 1;
        for (int i = 1; i < cycles.size(); i++) {
            long days = ChronoUnit.DAYS.between(
                    cycles.get(i - 1).getStartDate(),
                    cycles.get(i).getStartDate()
            );
            totalDays += (int) days;
        }

        // 3. Average: totalDays / number of intervals. Reliable only with enough data.
        int averageLength;
        boolean reliable = intervals >= MIN_CYCLES_FOR_RELIABLE;
        if (intervals > 0) {
            averageLength = totalDays / intervals;
        } else {
            averageLength = DEFAULT_CYCLE_LENGTH;
        }

        // 4. Predict next period = most recent period start + average cycle length
        LocalDate lastPeriodStart = cycles.get(cycles.size() - 1).getStartDate();
        LocalDate nextPeriod = lastPeriodStart.plusDays(averageLength);

        return new PredictionResponse(nextPeriod, averageLength, cycles.size(), reliable);
    }
}