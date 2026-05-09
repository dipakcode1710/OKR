package com.okr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "okr_objectives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OkrObjective {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "public_id", nullable = false, unique = true, columnDefinition = "CHAR(36)", updatable = false)
    private String publicId;

    @Column(name = "cycle_id", nullable = false)
    private Integer cycleId;

    @Column(name = "owner_employee_id", nullable = false)
    private Integer ownerEmployeeId;

    @Column(name = "owner_team_id")
    private Integer ownerTeamId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_objective_id")
    private OkrObjective parentObjective;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aligned_objective_id")
    private OkrObjective alignedObjective;

    @Column(name = "objective_title", nullable = false, length = 255)
    private String objectiveTitle;

    @Column(name = "objective_description", columnDefinition = "TEXT")
    private String objectiveDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "objective_scope", nullable = false)
    private ObjectiveScope objectiveScope = ObjectiveScope.team;

    @Enumerated(EnumType.STRING)
    @Column(name = "objective_type", nullable = false)
    private ObjectiveType objectiveType = ObjectiveType.committed;

    @Enumerated(EnumType.STRING)
    @Column(name = "goal_category", nullable = false)
    private GoalCategory goalCategory = GoalCategory.objective;

    @Column(name = "success_criteria", columnDefinition = "TEXT")
    private String successCriteria;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ObjectiveStatus status = ObjectiveStatus.draft;

    @Column(name = "progress_pct", nullable = false)
    private Integer progressPct = 0;

    @Column(name = "confidence_score")
    private Byte confidenceScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "scoring_method", nullable = false)
    private ScoringMethod scoringMethod = ScoringMethod.weighted_kr_average;

    @Enumerated(EnumType.STRING)
    @Column(name = "check_in_frequency", nullable = false)
    private CheckInFrequency checkInFrequency = CheckInFrequency.weekly;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "version_no", nullable = false)
    private Integer versionNo = 1;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "meta", columnDefinition = "json")
    private String meta;

    @PrePersist
    protected void onCreate() {
        if (publicId == null) {
            publicId = java.util.UUID.randomUUID().toString();
        }
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum ObjectiveScope { personal, team, department, company }
    public enum ObjectiveType { committed, aspirational, learning }
    public enum GoalCategory { objective, initiative, operational }
    public enum ObjectiveStatus { draft, active, at_risk, completed, cancelled, archived }
    public enum ScoringMethod { manual, weighted_kr_average, binary, milestone_based }
    public enum CheckInFrequency { weekly, biweekly, monthly }
}
