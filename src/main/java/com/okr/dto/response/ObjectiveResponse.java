package com.okr.dto.response;

import com.okr.entity.OkrObjective.ObjectiveScope;
import com.okr.entity.OkrObjective.ObjectiveStatus;
import com.okr.entity.OkrObjective.ObjectiveType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ObjectiveResponse {
    private Integer id;
    private Integer cycleId;
    private String cycleName;
    private Integer ownerEmployeeId;
    private Integer ownerTeamId;
    private Integer parentObjectiveId;
    private String objectiveTitle;
    private String objectiveDescription;
    private String successCriteria;
    private ObjectiveScope objectiveScope;
    private ObjectiveType objectiveType;
    private ObjectiveStatus status;
    private Integer progressPct;
    private LocalDate startDate;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Included when fetching a single objective with its KRs
    private List<KeyResultResponse> keyResults;
}
