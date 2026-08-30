package com.dearme.backend.controller;

import com.dearme.backend.dto.CycleEntryRequest;
import com.dearme.backend.dto.CycleEntryResponse;
import com.dearme.backend.dto.PredictionResponse;
import com.dearme.backend.service.CycleEntryService;
import com.dearme.backend.service.PredictionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CycleEntryController.class)
class CycleEntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CycleEntryService service;

    @MockitoBean
    private PredictionService predictionService;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String TEST_USER_ID = "user_123";

    @Test
    void getAllCycles_returnsList() throws Exception {
        CycleEntryResponse response = new CycleEntryResponse(
                1L, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 1, 5)
        );
        when(service.getCyclesForUser(TEST_USER_ID)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/v1/cycles")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].startDate").value("2026-01-01"))
                .andExpect(jsonPath("$[0].endDate").value("2026-01-05"));
    }

    @Test
    void createCycle_whenValid_returnsCreated() throws Exception {
        CycleEntryRequest request = new CycleEntryRequest(
                LocalDate.of(2026, 3, 1),
                LocalDate.of(2026, 3, 5)
        );
        CycleEntryResponse response = new CycleEntryResponse(
                10L, LocalDate.of(2026, 3, 1), LocalDate.of(2026, 3, 5)
        );
        when(service.createCycleForUser(eq(TEST_USER_ID), any(CycleEntryRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/cycles")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.startDate").value("2026-03-01"))
                .andExpect(jsonPath("$.endDate").value("2026-03-05"));
    }

    @Test
    void createCycle_whenMissingStartDate_returns400() throws Exception {
        String invalidJson = """
                {
                    "endDate": "2026-03-05"
                }
                """;

        mockMvc.perform(post("/api/v1/cycles")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors.startDate").value("startDate is required"));
    }

    @Test
    void createCycle_whenFutureStartDate_returns400() throws Exception {
        LocalDate future = LocalDate.now().plusDays(10);
        String invalidJson = """
                {
                    "startDate": "%s",
                    "endDate": "2026-03-05"
                }
                """.formatted(future);

        mockMvc.perform(post("/api/v1/cycles")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.startDate").value("startDate cannot be in the future"));
    }

    @Test
    void createCycle_whenEndBeforeStart_returns400() throws Exception {
        String invalidJson = """
                {
                    "startDate": "2026-03-10",
                    "endDate": "2026-03-05"
                }
                """;

        mockMvc.perform(post("/api/v1/cycles")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.endDateValid").value("endDate must be on or after startDate"));
    }

    @Test
    void getPrediction_returnsPrediction() throws Exception {
        PredictionResponse response = new PredictionResponse(
                LocalDate.of(2026, 7, 24), 28, 3, true
        );
        when(predictionService.getPredictionForUser(TEST_USER_ID)).thenReturn(response);

        mockMvc.perform(get("/api/v1/cycles/prediction")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nextPeriodDate").value("2026-07-24"))
                .andExpect(jsonPath("$.averageCycleLength").value(28))
                .andExpect(jsonPath("$.cycleCount").value(3))
                .andExpect(jsonPath("$.reliable").value(true));
    }

    @Test
    void getCycle_whenFound_returnsCycle() throws Exception {
        CycleEntryResponse response = new CycleEntryResponse(
                99L, LocalDate.of(2026, 5, 1), LocalDate.of(2026, 5, 5)
        );
        when(service.getCycleForUser(eq(TEST_USER_ID), eq(99L))).thenReturn(response);

        mockMvc.perform(get("/api/v1/cycles/99")
                        .with(jwt().jwt(j -> j.subject(TEST_USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(99))
                .andExpect(jsonPath("$.startDate").value("2026-05-01"))
                .andExpect(jsonPath("$.endDate").value("2026-05-05"));
    }
}