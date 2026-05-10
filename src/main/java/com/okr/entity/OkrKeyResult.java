package com.okr.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "okr_key_results")
@SQLRestriction("deleted_at IS NULL")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OkrKeyResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "objective_id", nullable = false)
    private OkrObjective objective;

    @Column(name = "key_result_title", nullable = false)
    private String keyResultTitle;

    @Column(name = "key_result_description", columnDefinition = "TEXT")
    private String keyResultDescription;

    @Column(name = "metric_name")
    private String metricName;

    @Column(name = "baseline_value", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal baselineValue = BigDecimal.ZERO;

    @Column(name = "target_value", nullable = false, precision = 12, scale = 2)
    private BigDecimal targetValue;

    @Column(name = "current_value", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal currentValue = BigDecimal.ZERO;

    @Column(name = "measurement_unit", length = 50)
    private String measurementUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "measurement_type", nullable = false)
    @Builder.Default
    private MeasurementType measurementType = MeasurementType.custom;

    @Column(name = "progress_pct", nullable = false)
    @Builder.Default
    private Integer progressPct = 0;

    // Weight used for rolling up to objective (all KRs in an objective should sum to 100)
    @Column(name = "weight_pct", nullable = false)
    @Builder.Default
    private Integer weightPct = 100;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false)
    @Builder.Default
    private ReviewStatus reviewStatus = ReviewStatus.draft;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

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

    @OneToMany(mappedBy = "keyResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OkrInitiative> initiatives = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum MeasurementType { percentage, count, currency, boolean_type, custom }
    public enum ReviewStatus    { draft, submitted, approved, closed }
}
