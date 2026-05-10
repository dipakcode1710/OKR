package com.okr.dto.request;

import com.okr.entity.OkrObjective.ObjectiveScope;
import com.okr.entity.OkrObjective.ObjectiveStatus;
import com.okr.entity.OkrObjective.ObjectiveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ObjectiveRequest {

    @NotNull(message = "Cycle ID is required")
    private Integer cycleId;

    @NotNull(message = "Owner employee ID is required")
    private Integer ownerEmployeeId;

    private Integer ownerTeamId;
    private Integer parentObjectiveId;

    @NotBlank(message = "Objective title is required")
    private String objectiveTitle;

    private String objectiveDescription;
    private String successCriteria;

    private ObjectiveScope objectiveScope = ObjectiveScope.personal;
    private ObjectiveType objectiveType   = ObjectiveType.committed;
    private ObjectiveStatus status        = ObjectiveStatus.draft;

    private LocalDate startDate;
    private LocalDate dueDate;

    private Integer createdBy;
}
