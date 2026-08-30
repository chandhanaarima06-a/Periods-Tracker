package com.dearme.backend.dto;

import java.time.LocalDate;

public class PredictionResponse {

    private LocalDate nextPeriodDate;
    private Integer averageCycleLength;
    private int cycleCount;
    private boolean reliable;

    public PredictionResponse() {
    }

    public PredictionResponse(LocalDate nextPeriodDate, Integer averageCycleLength, int cycleCount, boolean reliable) {
        this.nextPeriodDate = nextPeriodDate;
        this.averageCycleLength = averageCycleLength;
        this.cycleCount = cycleCount;
        this.reliable = reliable;
    }

    public LocalDate getNextPeriodDate() {
        return nextPeriodDate;
    }

    public void setNextPeriodDate(LocalDate nextPeriodDate) {
        this.nextPeriodDate = nextPeriodDate;
    }

    public Integer getAverageCycleLength() {
        return averageCycleLength;
    }

    public void setAverageCycleLength(Integer averageCycleLength) {
        this.averageCycleLength = averageCycleLength;
    }

    public int getCycleCount() {
        return cycleCount;
    }

    public void setCycleCount(int cycleCount) {
        this.cycleCount = cycleCount;
    }

    public boolean isReliable() {
        return reliable;
    }

    public void setReliable(boolean reliable) {
        this.reliable = reliable;
    }
}