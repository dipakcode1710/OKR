package com.okr.service;

import com.okr.dto.request.CheckInRequest;
import com.okr.dto.response.CheckInResponse;
import com.okr.entity.OkrCheckIn;
import com.okr.entity.OkrObjective;
import com.okr.exception.ResourceNotFoundException;
import com.okr.mapper.OkrCheckInMapper;
import com.okr.repository.OkrCheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OkrCheckInService {

    private final OkrCheckInRepository checkInRepository;
    private final OkrObjectiveService objectiveService;
    private final OkrKeyResultService keyResultService;
    private final OkrCheckInMapper checkInMapper;

    public List<CheckInResponse> getByObjective(Integer objectiveId) {
        return checkInMapper.toResponseList(
                checkInRepository.findByObjectiveIdOrderByCheckInDateDesc(objectiveId));
    }

    public List<CheckInResponse> getByKeyResult(Integer keyResultId) {
        return checkInMapper.toResponseList(
                checkInRepository.findByKeyResultIdOrderByCheckInDateDesc(keyResultId));
    }

    public CheckInResponse getById(Integer id) {
        return checkInMapper.toResponse(findOrThrow(id));
    }

    /**
     * Creates a check-in and updates the objective's progress_pct
     * to the value reported in this check-in.
     */
    @Transactional
    public CheckInResponse create(CheckInRequest request) {
        OkrObjective objective = objectiveService.findOrThrow(request.getObjectiveId());

        OkrCheckIn checkIn = checkInMapper.toEntity(request);
        checkIn.setObjective(objective);

        if (request.getKeyResultId() != null) {
            checkIn.setKeyResult(keyResultService.findOrThrow(request.getKeyResultId()));
        }

        OkrCheckIn saved = checkInRepository.save(checkIn);

        // Directly update the objective progress from the check-in report
        objective.setProgressPct(request.getProgressPct());
        objectiveService.recalculateProgress(objective.getId());

        return checkInMapper.toResponse(saved);
    }

    @Transactional
    public CheckInResponse update(Integer id, CheckInRequest request) {
        OkrCheckIn checkIn = findOrThrow(id);
        checkInMapper.updateEntity(checkIn, request);
        return checkInMapper.toResponse(checkInRepository.save(checkIn));
    }

    @Transactional
    public void delete(Integer id) {
        OkrCheckIn checkIn = findOrThrow(id);
        checkIn.setDeletedAt(LocalDateTime.now());
        checkInRepository.save(checkIn);
    }

    private OkrCheckIn findOrThrow(Integer id) {
        return checkInRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CheckIn", id));
    }
}
