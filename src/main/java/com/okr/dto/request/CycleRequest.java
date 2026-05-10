package com.okr.dto.request;

import com.okr.entity.OkrCycle.CycleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CycleRequest {

    @NotBlank(message = "Cycle name is required")
    private String cycleName;

    @NotBlank(message = "Cycle code is required")
    private String cycleCode;           // e.g. Q1-2026

    @NotNull(message = "Cycle type is required")
    private CycleType cycleType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private Integer createdBy;
}
