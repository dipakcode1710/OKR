package com.okr.service;

import com.okr.dto.request.CycleRequest;
import com.okr.dto.response.CycleResponse;
import com.okr.entity.OkrCycle;
import com.okr.exception.BadRequestException;
import com.okr.exception.ResourceNotFoundException;
import com.okr.mapper.OkrCycleMapper;
import com.okr.repository.OkrCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OkrCycleService {

    private final OkrCycleRepository cycleRepository;
    private final OkrCycleMapper cycleMapper;

    public List<CycleResponse> getAll() {
        return cycleMapper.toResponseList(cycleRepository.findAllByOrderByStartDateDesc());
    }

    public List<CycleResponse> getActive() {
        return cycleMapper.toResponseList(cycleRepository.findByIsActiveTrue());
    }

    public CycleResponse getById(Integer id) {
        return cycleMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public CycleResponse create(CycleRequest request) {
        if (cycleRepository.existsByCycleCode(request.getCycleCode())) {
            throw new BadRequestException("Cycle code '" + request.getCycleCode() + "' already exists");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }
        OkrCycle cycle = cycleMapper.toEntity(request);
        return cycleMapper.toResponse(cycleRepository.save(cycle));
    }

    @Transactional
    public CycleResponse update(Integer id, CycleRequest request) {
        OkrCycle cycle = findOrThrow(id);
        if (cycle.getIsLocked()) {
            throw new BadRequestException("Cycle is locked and cannot be modified");
        }
        cycleMapper.updateEntity(cycle, request);
        return cycleMapper.toResponse(cycleRepository.save(cycle));
    }

    @Transactional
    public void lock(Integer id) {
        OkrCycle cycle = findOrThrow(id);
        cycle.setIsLocked(true);
        cycleRepository.save(cycle);
    }

    @Transactional
    public void delete(Integer id) {
        OkrCycle cycle = findOrThrow(id);
        cycle.setDeletedAt(LocalDateTime.now());
        cycle.setIsActive(false);
        cycleRepository.save(cycle);
    }

    public OkrCycle findOrThrow(Integer id) {
        return cycleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OKR Cycle", id));
    }
}
