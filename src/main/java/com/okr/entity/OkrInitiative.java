package com.okr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "okr_initiatives")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OkrInitiative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Initiatives belong to a key result
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "key_result_id", nullable = false)
    private OkrKeyResult keyResult;

    @Column(name = "initiative_title", nullable = false)
    private String initiativeTitle;

    @Column(name = "initiative_description", columnDefinition = "TEXT")
    private String initiativeDescription;

    @Column(name = "owner_employee_id")
    private Integer ownerEmployeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "initiative_status", nullable = false)
    @Builder.Default
    private InitiativeStatus initiativeStatus = InitiativeStatus.planned;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @Builder.Default
    private Priority priority = Priority.medium;

    @Column(name = "completion_pct", nullable = false)
    @Builder.Default
    private Integer completionPct = 0;

    @Column(name = "blocker_note", columnDefinition = "TEXT")
    private String blockerNote;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

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

    public enum InitiativeStatus { planned, active, blocked, completed, cancelled }
    public enum Priority         { low, medium, high, critical }
}
