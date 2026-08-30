package com.dearme.backend.service;

import com.dearme.backend.dto.CycleEntryRequest;
import com.dearme.backend.dto.CycleEntryResponse;
import com.dearme.backend.entity.CycleEntry;
import com.dearme.backend.exception.ResourceNotFoundException;
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

    public List<CycleEntryResponse> getCyclesForUser(String userId) {
        return cycleEntryRepository.findByUserId(userId)
                .stream()
                .map(CycleEntryResponse::fromEntity)
                .toList();
    }

    public CycleEntryResponse createCycleForUser(String userId, CycleEntryRequest request) {
        CycleEntry entry = new CycleEntry();
        entry.setUserId(userId);
        entry.setStartDate(request.getStartDate());
        entry.setEndDate(request.getEndDate());
        CycleEntry saved = cycleEntryRepository.save(entry);
        return CycleEntryResponse.fromEntity(saved);
    }

    public CycleEntryResponse getCycleForUser(String userId, Long id) {
        return cycleEntryRepository.findByUserIdAndId(userId, id)
                .map(CycleEntryResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Cycle not found with id: " + id));
    }
}