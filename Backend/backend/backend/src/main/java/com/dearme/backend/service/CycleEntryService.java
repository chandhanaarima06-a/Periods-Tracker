package com.dearme.backend.service;

import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.repository.CycleEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CycleEntryService {

    private final CycleEntryRepository cycleEntryRepository;

    public CycleEntryService(CycleEntryRepository cycleEntryRepository) {
        this.cycleEntryRepository = cycleEntryRepository;
    }

    public List<CycleEntry> getCyclesForUser(String userId) {
        return cycleEntryRepository.findByUserId(userId);
    }

    public CycleEntry createCycleForUser(String userId, CycleEntry cycleEntry) {
        cycleEntry.setUserId(userId);
        return cycleEntryRepository.save(cycleEntry);
    }

    public Optional<CycleEntry> getCycleForUser(String userId, Long id) {
        return cycleEntryRepository.findByUserIdAndId(userId, id);
    }
}