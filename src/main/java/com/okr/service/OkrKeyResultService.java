package com.okr.service;

import com.okr.dto.request.KeyResultRequest;
import com.okr.dto.request.ProgressUpdateRequest;
import com.okr.dto.response.KeyResultResponse;
import com.okr.entity.OkrKeyResult;
import com.okr.entity.OkrObjective;
import com.okr.exception.BadRequestException;
import com.okr.exception.ResourceNotFoundException;
import com.okr.mapper.OkrKeyResultMapper;
import com.okr.repository.OkrKeyResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OkrKeyResultService {

    private final OkrKeyResultRepository keyResultRepository;
    private final OkrObjectiveService objectiveService;
    private final OkrKeyResultMapper keyResultMapper;

    public List<KeyResultResponse> getByObjective(Integer objectiveId) {
        return keyResultMapper.toResponseList(keyResultRepository.findByObjectiveId(objectiveId));
    }

    public KeyResultResponse getById(Integer id) {
        return keyResultMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public KeyResultResponse create(KeyResultRequest request) {
        OkrObjective objective = objectiveService.findOrThrow(request.getObjectiveId());

        // Warn if weights would exceed 100 — not a hard block, just a business concern
        int existingWeight = keyResultRepository.findActiveByObjectiveId(objective.getId())
                .stream().mapToInt(OkrKeyResult::getWeightPct).sum();
        if (existingWeight + request.getWeightPct() > 100) {
            throw new BadRequestException(
                    "Total weight of key results would exceed 100%. Current total: " + existingWeight);
        }

        OkrKeyResult kr = keyResultMapper.toEntity(request);
        kr.setObjective(objective);
        return keyResultMapper.toResponse(keyResultRepository.save(kr));
    }

    @Transactional
    public KeyResultResponse update(Integer id, KeyResultRequest request) {
        OkrKeyResult kr = findOrThrow(id);
        keyResultMapper.updateEntity(kr, request);
        return keyResultMapper.toResponse(keyResultRepository.save(kr));
    }

    /**
     * Core update: employee sets the new current value.
     * Progress % is auto-calculated, then objective progress is rolled up.
     */
    @Transactional
    public KeyResultResponse updateProgress(Integer id, ProgressUpdateRequest request) {
        OkrKeyResult kr = findOrThrow(id);

        kr.setCurrentValue(request.getCurrentValue());
        kr.setUpdatedBy(request.getUpdatedBy());

        // Calculate progress % from current vs target
        if (request.getProgressPct() != null) {
            // Manual override provided
            kr.setProgressPct(request.getProgressPct());
        } else {
            int calculated = calculateProgressPct(kr.getBaselineValue(),
                    kr.getTargetValue(), request.getCurrentValue());
            kr.setProgressPct(calculated);
        }

        keyResultRepository.save(kr);

        // Roll up to the parent objective — always in same transaction
        objectiveService.recalculateProgress(kr.getObjective().getId());

        return keyResultMapper.toResponse(kr);
    }

    @Transactional
    public void delete(Integer id) {
        OkrKeyResult kr = findOrThrow(id);
        kr.setDeletedAt(LocalDateTime.now());
        kr.setIsActive(false);
        keyResultRepository.save(kr);
        // Recalculate objective after removing a KR
        objectiveService.recalculateProgress(kr.getObjective().getId());
    }

    /**
     * progress = (current - baseline) / (target - baseline) * 100
     * Clamped to 0–100.
     */
    private int calculateProgressPct(BigDecimal baseline, BigDecimal target, BigDecimal current) {
        BigDecimal range = target.subtract(baseline);
        if (range.compareTo(BigDecimal.ZERO) == 0) return 0;

        BigDecimal progress = current.subtract(baseline)
                .divide(range, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        int pct = progress.setScale(0, RoundingMode.HALF_UP).intValue();
        return Math.max(0, Math.min(100, pct));
    }

    public OkrKeyResult findOrThrow(Integer id) {
        return keyResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Key Result", id));
    }
}
