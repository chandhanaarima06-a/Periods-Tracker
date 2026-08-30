package com.dearme.backend.controller;

import com.dearme.backend.dto.CycleEntryRequest;
import com.dearme.backend.dto.CycleEntryResponse;
import com.dearme.backend.dto.PredictionResponse;
import com.dearme.backend.service.CycleEntryService;
import com.dearme.backend.service.PredictionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cycles")
public class CycleEntryController {

    private final CycleEntryService cycleEntryService;
    private final PredictionService predictionService;

    public CycleEntryController(CycleEntryService cycleEntryService, PredictionService predictionService) {
        this.cycleEntryService = cycleEntryService;
        this.predictionService = predictionService;
    }

    @GetMapping
    public List<CycleEntryResponse> getAllCycles(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return cycleEntryService.getCyclesForUser(userId);
    }

    @PostMapping
    public CycleEntryResponse createCycle(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CycleEntryRequest request) {
        String userId = jwt.getSubject();
        return cycleEntryService.createCycleForUser(userId, request);
    }

    @GetMapping("/prediction")
    public PredictionResponse getPrediction(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return predictionService.getPredictionForUser(userId);
    }

    @GetMapping("/{id}")
    public CycleEntryResponse getCycle(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        String userId = jwt.getSubject();
        return cycleEntryService.getCycleForUser(userId, id);
    }
}