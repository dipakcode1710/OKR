package com.okr.dto.response;

import com.okr.entity.OkrInitiative.InitiativeStatus;
import com.okr.entity.OkrInitiative.Priority;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InitiativeResponse {
    private Integer id;
    private Integer keyResultId;
    private String initiativeTitle;
    private String initiativeDescription;
    private Integer ownerEmployeeId;
    private InitiativeStatus initiativeStatus;
    private Priority priority;
    private Integer completionPct;
    private String blockerNote;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
