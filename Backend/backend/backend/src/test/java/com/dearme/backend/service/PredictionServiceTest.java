package com.dearme.backend.service;

import com.dearme.backend.dto.FertilityWindowResponse;
import com.dearme.backend.dto.PredictionResponse;
import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.repository.CycleEntryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock
    private CycleEntryRepository repository;

    @InjectMocks
    private PredictionService service;

    private static final String USER_ID = "user_123";

    private CycleEntry cycle(LocalDate start) {
        CycleEntry e = new CycleEntry();
        e.setUserId(USER_ID);
        e.setStartDate(start);
        e.setEndDate(start.plusDays(5));
        return e;
    }

    @Test
    void getPrediction_whenNoCycles_returnsNotReliable() {
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of());

        PredictionResponse result = service.getPredictionForUser(USER_ID);

        assertThat(result.getNextPeriodDate()).isNull();
        assertThat(result.getAverageCycleLength()).isNull();
        assertThat(result.getCycleCount()).isZero();
        assertThat(result.isReliable()).isFalse();
    }

    @Test
    void getPrediction_whenOneCycle_fallsBackTo28NotReliable() {
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID))
                .thenReturn(List.of(cycle(LocalDate.of(2026, 1, 1))));

        PredictionResponse result = service.getPredictionForUser(USER_ID);

        assertThat(result.getAverageCycleLength()).isEqualTo(28);
        assertThat(result.getNextPeriodDate()).isEqualTo(LocalDate.of(2026, 1, 29));
        assertThat(result.isReliable()).isFalse();
    }

    @Test
    void getPrediction_averagesConsecutiveGaps() {
        // May 1 -> May 29 = 28 days, May 29 -> Jun 26 = 28 days
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of(
                cycle(LocalDate.of(2026, 5, 1)),
                cycle(LocalDate.of(2026, 5, 29)),
                cycle(LocalDate.of(2026, 6, 26))
        ));

        PredictionResponse result = service.getPredictionForUser(USER_ID);

        assertThat(result.getAverageCycleLength()).isEqualTo(28);
        assertThat(result.getNextPeriodDate()).isEqualTo(LocalDate.of(2026, 7, 24));
        assertThat(result.getCycleCount()).isEqualTo(3);
        assertThat(result.isReliable()).isTrue();
    }

    @Test
    void getPrediction_usesOnlyStartDateGapsRegardlessOfEndDates() {
        // Gaps: 20 days, 40 days -> average 30
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of(
                cycle(LocalDate.of(2026, 1, 1)),
                cycle(LocalDate.of(2026, 1, 21)),
                cycle(LocalDate.of(2026, 3, 2))
        ));

        PredictionResponse result = service.getPredictionForUser(USER_ID);

        assertThat(result.getAverageCycleLength()).isEqualTo(30);
        assertThat(result.getNextPeriodDate()).isEqualTo(LocalDate.of(2026, 4, 1));
        assertThat(result.isReliable()).isTrue();
    }

    @Test
    void getFertileWindow_whenNoCycles_returnsNullsNotReliable() {
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of());

        FertilityWindowResponse result = service.getFertileWindowForUser(USER_ID);

        assertThat(result.getOvulationDate()).isNull();
        assertThat(result.getFertileStart()).isNull();
        assertThat(result.getFertileEnd()).isNull();
        assertThat(result.isReliable()).isFalse();
    }

    @Test
    void getFertileWindow_derivesFromPrediction() {
        // Prediction: next period Jul 24, avg 28, reliable
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of(
                cycle(LocalDate.of(2026, 5, 1)),
                cycle(LocalDate.of(2026, 5, 29)),
                cycle(LocalDate.of(2026, 6, 26))
        ));

        FertilityWindowResponse result = service.getFertileWindowForUser(USER_ID);

        // Ovulation = Jul 24 - 14 = Jul 10; fertile = Jul 10 - 5 = Jul 5 through Jul 11 (egg viability +1)
        assertThat(result.getOvulationDate()).isEqualTo(LocalDate.of(2026, 7, 10));
        assertThat(result.getFertileStart()).isEqualTo(LocalDate.of(2026, 7, 5));
        assertThat(result.getFertileEnd()).isEqualTo(LocalDate.of(2026, 7, 11));
        assertThat(result.isReliable()).isTrue();
    }

    @Test
    void getFertileWindow_whenOneCycle_computesButNotReliable() {
        // Prediction: Jan 1 + 28 (fallback) = Jan 29, not reliable
        when(repository.findByUserIdOrderByStartDateAsc(USER_ID)).thenReturn(List.of(
                cycle(LocalDate.of(2026, 1, 1))
        ));

        FertilityWindowResponse result = service.getFertileWindowForUser(USER_ID);

        assertThat(result.getOvulationDate()).isEqualTo(LocalDate.of(2026, 1, 15));
        assertThat(result.getFertileStart()).isEqualTo(LocalDate.of(2026, 1, 10));
        assertThat(result.getFertileEnd()).isEqualTo(LocalDate.of(2026, 1, 16));
        assertThat(result.isReliable()).isFalse();
    }
}