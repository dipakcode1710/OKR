package com.okr.dto.request;

import com.okr.entity.OkrInitiative.InitiativeStatus;
import com.okr.entity.OkrInitiative.Priority;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class InitiativeRequest {

    @NotNull(message = "Key result ID is required")
    private Integer keyResultId;

    @NotBlank(message = "Initiative title is required")
    private String initiativeTitle;

    private String initiativeDescription;
    private Integer ownerEmployeeId;

    private InitiativeStatus initiativeStatus = InitiativeStatus.planned;
    private Priority priority                 = Priority.medium;

    @Min(0) @Max(100)
    private Integer completionPct = 0;

    private String blockerNote;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Integer sortOrder = 0;
    private Integer createdBy;
}
