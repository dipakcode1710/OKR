package com.okr.dto.response;

import com.okr.entity.OkrCheckIn.HealthStatus;
import com.okr.entity.OkrCheckIn.UpdateType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CheckInResponse {
    private Integer id;
    private Integer objectiveId;
    private Integer keyResultId;
    private Integer employeeId;
    private LocalDate checkInDate;
    private Integer weekNumber;
    private UpdateType updateType;
    private String summary;
    private String details;
    private Integer progressPct;
    private HealthStatus healthStatus;
    private String wins;
    private String blockers;
    private String nextSteps;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
