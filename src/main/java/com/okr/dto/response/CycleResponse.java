package com.okr.dto.response;

import com.okr.entity.OkrCycle.CycleType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CycleResponse {
    private Integer id;
    private String cycleName;
    private String cycleCode;
    private CycleType cycleType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isLocked;
    private Boolean isActive;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
