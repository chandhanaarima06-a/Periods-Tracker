package com.dearme.backend.dto;

import com.dearme.backend.entity.CycleEntry;

import java.time.LocalDate;

public class CycleEntryResponse {

    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;

    public CycleEntryResponse() {
    }

    public CycleEntryResponse(Long id, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public static CycleEntryResponse fromEntity(CycleEntry entry) {
        return new CycleEntryResponse(entry.getId(), entry.getStartDate(), entry.getEndDate());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}