package com.dearme.backend.repository;

import com.dearme.backend.entity.CycleEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CycleEntryRepository extends JpaRepository<CycleEntry, Long> {
    List<CycleEntry> findByUserId(String userId);
    Optional<CycleEntry> findByUserIdAndId(String userId, Long id);
}