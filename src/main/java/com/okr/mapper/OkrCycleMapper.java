package com.okr.mapper;

import com.okr.dto.request.CycleRequest;
import com.okr.dto.response.CycleResponse;
import com.okr.entity.OkrCycle;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OkrCycleMapper {

    OkrCycle toEntity(CycleRequest request);

    CycleResponse toResponse(OkrCycle cycle);

    List<CycleResponse> toResponseList(List<OkrCycle> cycles);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget OkrCycle cycle, CycleRequest request);
}
