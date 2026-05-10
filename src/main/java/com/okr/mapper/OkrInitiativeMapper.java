package com.okr.mapper;

import com.okr.dto.request.InitiativeRequest;
import com.okr.dto.response.InitiativeResponse;
import com.okr.entity.OkrInitiative;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface OkrInitiativeMapper {

    @Mapping(target = "keyResult", ignore = true)
    OkrInitiative toEntity(InitiativeRequest request);

    @Mapping(source = "keyResult.id", target = "keyResultId")
    InitiativeResponse toResponse(OkrInitiative initiative);

    List<InitiativeResponse> toResponseList(List<OkrInitiative> initiatives);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "keyResult", ignore = true)
    void updateEntity(@MappingTarget OkrInitiative initiative, InitiativeRequest request);
}
