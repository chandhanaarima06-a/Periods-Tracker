package com.dearme.backend.service;

import com.dearme.backend.dto.CycleEntryRequest;
import com.dearme.backend.dto.CycleEntryResponse;
import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.exception.ResourceNotFoundException;
import com.dearme.backend.repository.CycleEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CycleEntryServiceTest {

    @Mock
    private CycleEntryRepository repository;

    @InjectMocks
    private CycleEntryService service;

    private static final String USER_ID = "user_123";

    @BeforeEach
    void setUp() {
    }

    @Test
    void getCyclesForUser_returnsMappedResponses() {
        CycleEntry e1 = new CycleEntry();
        e1.setId(1L);
        e1.setUserId(USER_ID);
        e1.setStartDate(LocalDate.of(2026, 1, 1));
        e1.setEndDate(LocalDate.of(2026, 1, 5));

        CycleEntry e2 = new CycleEntry();
        e2.setId(2L);
        e2.setUserId(USER_ID);
        e2.setStartDate(LocalDate.of(2026, 2, 1));
        e2.setEndDate(LocalDate.of(2026, 2, 5));

        when(repository.findByUserId(USER_ID)).thenReturn(List.of(e1, e2));

        List<CycleEntryResponse> result = service.getCyclesForUser(USER_ID);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getStartDate()).isEqualTo(LocalDate.of(2026, 1, 1));
        assertThat(result.get(1).getId()).isEqualTo(2L);
    }

    @Test
    void createCycleForUser_savesAndReturnsResponse() {
        CycleEntryRequest request = new CycleEntryRequest(
                LocalDate.of(2026, 3, 1),
                LocalDate.of(2026, 3, 5)
        );

        CycleEntry saved = new CycleEntry();
        saved.setId(10L);
        saved.setUserId(USER_ID);
        saved.setStartDate(request.getStartDate());
        saved.setEndDate(request.getEndDate());

        when(repository.save(any(CycleEntry.class))).thenReturn(saved);

        CycleEntryResponse result = service.createCycleForUser(USER_ID, request);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getStartDate()).isEqualTo(request.getStartDate());
        assertThat(result.getEndDate()).isEqualTo(request.getEndDate());

        verify(repository).save(argThat(entry ->
                entry.getUserId().equals(USER_ID) &&
                entry.getStartDate().equals(request.getStartDate()) &&
                entry.getEndDate().equals(request.getEndDate())
        ));
    }

    @Test
    void getCycleForUser_whenFound_returnsResponse() {
        CycleEntry entry = new CycleEntry();
        entry.setId(99L);
        entry.setUserId(USER_ID);
        entry.setStartDate(LocalDate.of(2026, 5, 1));
        entry.setEndDate(LocalDate.of(2026, 5, 5));

        when(repository.findByUserIdAndId(USER_ID, 99L)).thenReturn(Optional.of(entry));

        CycleEntryResponse result = service.getCycleForUser(USER_ID, 99L);

        assertThat(result.getId()).isEqualTo(99L);
        assertThat(result.getStartDate()).isEqualTo(LocalDate.of(2026, 5, 1));
    }

    @Test
    void getCycleForUser_whenNotFound_throwsResourceNotFound() {
        when(repository.findByUserIdAndId(USER_ID, 404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.getCycleForUser(USER_ID, 404L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Cycle not found with id: 404");
    }
}