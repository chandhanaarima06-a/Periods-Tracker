package com.dearme.backend.dto;

import java.time.LocalDate;

public class FertilityWindowResponse {

    private LocalDate ovulationDate;
    private LocalDate fertileStart;
    private LocalDate fertileEnd;
    private boolean reliable;

    public FertilityWindowResponse() {
    }

    public FertilityWindowResponse(LocalDate ovulationDate, LocalDate fertileStart, LocalDate fertileEnd, boolean reliable) {
        this.ovulationDate = ovulationDate;
        this.fertileStart = fertileStart;
        this.fertileEnd = fertileEnd;
        this.reliable = reliable;
    }

    public LocalDate getOvulationDate() {
        return ovulationDate;
    }

    public void setOvulationDate(LocalDate ovulationDate) {
        this.ovulationDate = ovulationDate;
    }

    public LocalDate getFertileStart() {
        return fertileStart;
    }

    public void setFertileStart(LocalDate fertileStart) {
        this.fertileStart = fertileStart;
    }

    public LocalDate getFertileEnd() {
        return fertileEnd;
    }

    public void setFertileEnd(LocalDate fertileEnd) {
        this.fertileEnd = fertileEnd;
    }

    public boolean isReliable() {
        return reliable;
    }

    public void setReliable(boolean reliable) {
        this.reliable = reliable;
    }
}
