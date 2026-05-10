package com.okr.dto.request;

import com.okr.entity.OkrCheckIn.HealthStatus;
import com.okr.entity.OkrCheckIn.UpdateType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CheckInRequest {

    @NotNull(message = "Objective ID is required")
    private Integer objectiveId;

    // Optional — if check-in is against a specific KR
    private Integer keyResultId;

    @NotNull(message = "Employee ID is required")
    private Integer employeeId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    private Integer weekNumber;

    private UpdateType updateType = UpdateType.progress_update;

    private String summary;
    private String details;

    @Min(0) @Max(100)
    private Integer progressPct = 0;

    private HealthStatus healthStatus = HealthStatus.green;
    private String wins;
    private String blockers;
    private String nextSteps;
}
