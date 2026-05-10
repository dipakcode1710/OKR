package com.okr.mapper;

import com.okr.dto.request.CheckInRequest;
import com.okr.dto.response.CheckInResponse;
import com.okr.entity.OkrCheckIn;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OkrCheckInMapper {

    @Mapping(target = "objective", ignore = true)
    @Mapping(target = "keyResult", ignore = true)
    OkrCheckIn toEntity(CheckInRequest request);

    @Mapping(source = "objective.id", target = "objectiveId")
    @Mapping(source = "keyResult.id",  target = "keyResultId")
    CheckInResponse toResponse(OkrCheckIn checkIn);

    List<CheckInResponse> toResponseList(List<OkrCheckIn> checkIns);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "objective", ignore = true)
    @Mapping(target = "keyResult",  ignore = true)
    void updateEntity(@MappingTarget OkrCheckIn checkIn, CheckInRequest request);
}
