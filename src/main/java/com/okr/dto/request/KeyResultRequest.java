package com.okr.dto.request;

import com.okr.entity.OkrKeyResult.MeasurementType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class KeyResultRequest {

    @NotNull(message = "Objective ID is required")
    private Integer objectiveId;

    @NotBlank(message = "Key result title is required")
    private String keyResultTitle;

    private String keyResultDescription;
    private String metricName;
    private String measurementUnit;

    @NotNull
    private BigDecimal baselineValue;

    @NotNull(message = "Target value is required")
    private BigDecimal targetValue;

    private MeasurementType measurementType = MeasurementType.custom;

    @Min(1) @Max(100)
    private Integer weightPct = 100;

    private Integer createdBy;
}
