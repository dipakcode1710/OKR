package com.okr.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "okr_check_ins")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter 
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OkrCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "objective_id", nullable = false)
    private OkrObjective objective;

    // Optional: check-in can be against a specific KR or just the overall objective
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_result_id")
    private OkrKeyResult keyResult;

    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "update_type", nullable = false)
    @Builder.Default
    private UpdateType updateType = UpdateType.progress_update;

    @Column(name = "summary", length = 500)
    private String summary;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    // The progress reported at this check-in
    @Column(name = "progress_pct", nullable = false)
    @Builder.Default
    private Integer progressPct = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    @Builder.Default
    private HealthStatus healthStatus = HealthStatus.green;

    @Column(name = "wins", columnDefinition = "TEXT")
    private String wins;

    @Column(name = "blockers", columnDefinition = "TEXT")
    private String blockers;

    @Column(name = "next_steps", columnDefinition = "TEXT")
    private String nextSteps;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UpdateType   { progress_update, milestone, risk, blocker, general }
    public enum HealthStatus { green, amber, red }
}
