package com.dearme.backend.controller;

import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.service.CycleEntryService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cycles")
public class CycleEntryController {

    private final CycleEntryService cycleEntryService;

    public CycleEntryController(CycleEntryService cycleEntryService) {
        this.cycleEntryService = cycleEntryService;
    }

    @GetMapping
    public List<CycleEntry> getAllCycles(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // Clerk's 'sub' claim = user ID
        return cycleEntryService.getCyclesForUser(userId);
    }

    @PostMapping
    public CycleEntry createCycle(@AuthenticationPrincipal Jwt jwt, @RequestBody CycleEntry cycleEntry) {
        String userId = jwt.getSubject();
        return cycleEntryService.createCycleForUser(userId, cycleEntry);
    }
}