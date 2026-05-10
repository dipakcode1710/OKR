package com.okr.mapper;

import com.okr.dto.request.KeyResultRequest;
import com.okr.dto.response.KeyResultResponse;
import com.okr.entity.OkrKeyResult;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OkrKeyResultMapper {

    @Mapping(target = "objective", ignore = true)
    @Mapping(target = "initiatives", ignore = true)
    OkrKeyResult toEntity(KeyResultRequest request);

    @Mapping(source = "objective.id", target = "objectiveId")
    KeyResultResponse toResponse(OkrKeyResult kr);

    List<KeyResultResponse> toResponseList(List<OkrKeyResult> krs);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "objective", ignore = true)
    @Mapping(target = "initiatives", ignore = true)
    void updateEntity(@MappingTarget OkrKeyResult kr, KeyResultRequest request);
}
