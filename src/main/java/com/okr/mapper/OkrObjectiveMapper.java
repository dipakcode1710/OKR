package com.okr.mapper;

import com.okr.dto.request.ObjectiveRequest;
import com.okr.dto.response.KeyResultResponse;
import com.okr.dto.response.ObjectiveResponse;
import com.okr.entity.OkrKeyResult;
import com.okr.entity.OkrObjective;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OkrObjectiveMapper {

    @Mapping(target = "cycle", ignore = true)
    @Mapping(target = "parentObjective", ignore = true)
    @Mapping(target = "keyResults", ignore = true)
    OkrObjective toEntity(ObjectiveRequest request);

    @Mapping(source = "cycle.id",   target = "cycleId")
    @Mapping(source = "cycle.cycleName", target = "cycleName")
    @Mapping(source = "parentObjective.id", target = "parentObjectiveId")
    @Mapping(target = "keyResults", ignore = true)   // loaded on demand in service
    ObjectiveResponse toResponse(OkrObjective objective);

    List<ObjectiveResponse> toResponseList(List<OkrObjective> objectives);

    // Convenience method used in OkrObjectiveService.getById()
    List<KeyResultResponse> toKeyResultResponses(List<OkrKeyResult> keyResults);

    @Mapping(source = "objective.id", target = "objectiveId")
    KeyResultResponse toKeyResultResponse(OkrKeyResult kr);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "cycle", ignore = true)
    @Mapping(target = "parentObjective", ignore = true)
    @Mapping(target = "keyResults", ignore = true)
    void updateEntity(@MappingTarget OkrObjective objective, ObjectiveRequest request);
}
