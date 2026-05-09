package com.okr.dto;

import com.okr.entity.OkrObjective.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OkrObjectiveDTO {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Request {

        @NotNull(message = "cycle_id is required")
        private Integer cycleId;

        @NotNull(message = "owner_employee_id is required")
        private Integer ownerEmployeeId;

        private Integer ownerTeamId;
        private Integer parentObjectiveId;
        private Integer alignedObjectiveId;

        @NotBlank(message = "objective_title is required")
        @Size(max = 255)
        private String objectiveTitle;

        private String objectiveDescription;

        private ObjectiveScope objectiveScope;
        private ObjectiveType objectiveType;
        private GoalCategory goalCategory;
        private String successCriteria;
        private ObjectiveStatus status;

        @Min(0) @Max(100)
        private Integer progressPct;

        @Min(0) @Max(10)
        private Byte confidenceScore;

        private ScoringMethod scoringMethod;
        private CheckInFrequency checkInFrequency;
        private LocalDate startDate;
        private LocalDate dueDate;
        private Integer createdBy;
        private Integer updatedBy;
        private String meta;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Response {
        private Integer id;
        private String publicId;
        private Integer cycleId;
        private Integer ownerEmployeeId;
        private Integer ownerTeamId;
        private Integer parentObjectiveId;
        private Integer alignedObjectiveId;
        private String objectiveTitle;
        private String objectiveDescription;
        private ObjectiveScope objectiveScope;
        private ObjectiveType objectiveType;
        private GoalCategory goalCategory;
        private String successCriteria;
        private ObjectiveStatus status;
        private Integer progressPct;
        private Byte confidenceScore;
        private ScoringMethod scoringMethod;
        private CheckInFrequency checkInFrequency;
        private LocalDate startDate;
        private LocalDate dueDate;
        private Integer versionNo;
        private Boolean isActive;
        private LocalDateTime deletedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Integer createdBy;
        private Integer updatedBy;
        private String meta;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class StatusUpdate {
        @NotNull(message = "status is required")
        private ObjectiveStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProgressUpdate {
        @NotNull(message = "progressPct is required")
        @Min(0) @Max(100)
        private Integer progressPct;

        @Min(0) @Max(10)
        private Byte confidenceScore;
    }
}
