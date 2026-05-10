package com.okr.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Used when an employee updates current_value (or progress_pct directly)
 * on a key result. The service will recalculate objective progress automatically.
 */
@Data
public class ProgressUpdateRequest {

    @NotNull
    private BigDecimal currentValue;

    // Optional manual override; if null, service calculates from currentValue/targetValue
    @Min(0) @Max(100)
    private Integer progressPct;

    private Integer updatedBy;
}
