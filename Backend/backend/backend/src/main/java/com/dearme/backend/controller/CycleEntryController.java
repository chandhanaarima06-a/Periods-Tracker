package com.dearme.backend.controller;

import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.repository.CycleEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cycles")
public class CycleEntryController {
    @Autowired
    private CycleEntryRepository cycleEntryRepository;


    @GetMapping
    public List<CycleEntry> getAllCycles() {
        return cycleEntryRepository.findAll();
    }
    @PostMapping
    public CycleEntry createCycle (@RequestBody CycleEntry cycleEntry){
        return cycleEntryRepository.save(cycleEntry);
    }
}