package com.okr.dto.response;

import com.okr.entity.OkrKeyResult.MeasurementType;
import com.okr.entity.OkrKeyResult.ReviewStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class KeyResultResponse {
    private Integer id;
    private Integer objectiveId;
    private String keyResultTitle;
    private String keyResultDescription;
    private String metricName;
    private String measurementUnit;
    private BigDecimal baselineValue;
    private BigDecimal targetValue;
    private BigDecimal currentValue;
    private MeasurementType measurementType;
    private Integer progressPct;
    private Integer weightPct;
    private ReviewStatus reviewStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
