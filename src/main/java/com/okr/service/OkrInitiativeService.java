package com.okr.service;

import com.okr.dto.request.InitiativeRequest;
import com.okr.dto.response.InitiativeResponse;
import com.okr.entity.OkrInitiative;
import com.okr.entity.OkrKeyResult;
import com.okr.exception.ResourceNotFoundException;
import com.okr.mapper.OkrInitiativeMapper;
import com.okr.repository.OkrInitiativeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OkrInitiativeService {

    private final OkrInitiativeRepository initiativeRepository;
    private final OkrKeyResultService keyResultService;
    private final OkrInitiativeMapper initiativeMapper;

    public List<InitiativeResponse> getByKeyResult(Integer keyResultId) {
        return initiativeMapper.toResponseList(
                initiativeRepository.findByKeyResultIdOrderBySortOrderAsc(keyResultId));
    }

    public InitiativeResponse getById(Integer id) {
        return initiativeMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public InitiativeResponse create(InitiativeRequest request) {
        OkrKeyResult kr = keyResultService.findOrThrow(request.getKeyResultId());
        OkrInitiative initiative = initiativeMapper.toEntity(request);
        initiative.setKeyResult(kr);
        return initiativeMapper.toResponse(initiativeRepository.save(initiative));
    }

    @Transactional
    public InitiativeResponse update(Integer id, InitiativeRequest request) {
        OkrInitiative initiative = findOrThrow(id);
        initiativeMapper.updateEntity(initiative, request);
        return initiativeMapper.toResponse(initiativeRepository.save(initiative));
    }

    @Transactional
    public void delete(Integer id) {
        OkrInitiative initiative = findOrThrow(id);
        initiative.setDeletedAt(LocalDateTime.now());
        initiativeRepository.save(initiative);
    }

    private OkrInitiative findOrThrow(Integer id) {
        return initiativeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Initiative", id));
    }
}
