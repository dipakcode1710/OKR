package com.okr.service;

import com.okr.dto.OkrObjectiveDTO;
import com.okr.entity.OkrObjective;
import com.okr.exception.ResourceNotFoundException;
import com.okr.repository.OkrObjectiveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OkrObjectiveService {

    private final OkrObjectiveRepository repository;

    // ─── CREATE ────────────────────────────────────────────────────────────────

    public OkrObjectiveDTO.Response create(OkrObjectiveDTO.Request req) {
        OkrObjective obj = buildFromRequest(new OkrObjective(), req);
        return toResponse(repository.save(obj));
    }

    // ─── READ ──────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getAll() {
        return repository.findByDeletedAtIsNull()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OkrObjectiveDTO.Response getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public OkrObjectiveDTO.Response getByPublicId(String publicId) {
        OkrObjective obj = repository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("OkrObjective not found with publicId: " + publicId));
        return toResponse(obj);
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getByCycle(Integer cycleId) {
        return repository.findByCycleIdAndDeletedAtIsNull(cycleId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getByEmployee(Integer employeeId) {
        return repository.findByOwnerEmployeeIdAndDeletedAtIsNull(employeeId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getByTeam(Integer teamId) {
        return repository.findByOwnerTeamIdAndDeletedAtIsNull(teamId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getByStatus(OkrObjective.ObjectiveStatus status) {
        return repository.findByStatusAndDeletedAtIsNull(status)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getChildren(Integer parentId) {
        return repository.findByParentObjectiveId(parentId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OkrObjectiveDTO.Response> getAligned(Integer alignedId) {
        return repository.findByAlignedObjectiveId(alignedId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    public OkrObjectiveDTO.Response update(Integer id, OkrObjectiveDTO.Request req) {
        OkrObjective obj = findOrThrow(id);
        buildFromRequest(obj, req);
        obj.setVersionNo(obj.getVersionNo() + 1);
        return toResponse(repository.save(obj));
    }

    public OkrObjectiveDTO.Response updateStatus(Integer id, OkrObjectiveDTO.StatusUpdate req) {
        OkrObjective obj = findOrThrow(id);
        obj.setStatus(req.getStatus());
        return toResponse(repository.save(obj));
    }

    public OkrObjectiveDTO.Response updateProgress(Integer id, OkrObjectiveDTO.ProgressUpdate req) {
        OkrObjective obj = findOrThrow(id);
        obj.setProgressPct(req.getProgressPct());
        if (req.getConfidenceScore() != null) {
            obj.setConfidenceScore(req.getConfidenceScore());
        }
        return toResponse(repository.save(obj));
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    /** Soft delete */
    public void softDelete(Integer id) {
        OkrObjective obj = findOrThrow(id);
        obj.setDeletedAt(LocalDateTime.now());
        obj.setIsActive(false);
        repository.save(obj);
    }

    /** Hard (permanent) delete */
    public void hardDelete(Integer id) {
        OkrObjective obj = findOrThrow(id);
        repository.delete(obj);
    }

    /** Restore a soft-deleted objective */
    public OkrObjectiveDTO.Response restore(Integer id) {
        OkrObjective obj = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OkrObjective", id));
        obj.setDeletedAt(null);
        obj.setIsActive(true);
        return toResponse(repository.save(obj));
    }

    // ─── HELPERS ───────────────────────────────────────────────────────────────

    private OkrObjective findOrThrow(Integer id) {
        return repository.findById(id)
                .filter(o -> o.getDeletedAt() == null)
                .orElseThrow(() -> new ResourceNotFoundException("OkrObjective", id));
    }

    private OkrObjective buildFromRequest(OkrObjective obj, OkrObjectiveDTO.Request req) {
        obj.setCycleId(req.getCycleId());
        obj.setOwnerEmployeeId(req.getOwnerEmployeeId());
        obj.setOwnerTeamId(req.getOwnerTeamId());
        obj.setObjectiveTitle(req.getObjectiveTitle());
        obj.setObjectiveDescription(req.getObjectiveDescription());
        obj.setSuccessCriteria(req.getSuccessCriteria());
        obj.setMeta(req.getMeta());
        obj.setCreatedBy(req.getCreatedBy());
        obj.setUpdatedBy(req.getUpdatedBy());
        obj.setStartDate(req.getStartDate());
        obj.setDueDate(req.getDueDate());

        if (req.getObjectiveScope() != null) obj.setObjectiveScope(req.getObjectiveScope());
        if (req.getObjectiveType() != null) obj.setObjectiveType(req.getObjectiveType());
        if (req.getGoalCategory() != null) obj.setGoalCategory(req.getGoalCategory());
        if (req.getStatus() != null) obj.setStatus(req.getStatus());
        if (req.getScoringMethod() != null) obj.setScoringMethod(req.getScoringMethod());
        if (req.getCheckInFrequency() != null) obj.setCheckInFrequency(req.getCheckInFrequency());
        if (req.getProgressPct() != null) obj.setProgressPct(req.getProgressPct());
        if (req.getConfidenceScore() != null) obj.setConfidenceScore(req.getConfidenceScore());

        // Resolve parent / aligned references
        if (req.getParentObjectiveId() != null) {
            OkrObjective parent = repository.findById(req.getParentObjectiveId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent OkrObjective", req.getParentObjectiveId()));
            obj.setParentObjective(parent);
        } else {
            obj.setParentObjective(null);
        }

        if (req.getAlignedObjectiveId() != null) {
            OkrObjective aligned = repository.findById(req.getAlignedObjectiveId())
                    .orElseThrow(() -> new ResourceNotFoundException("Aligned OkrObjective", req.getAlignedObjectiveId()));
            obj.setAlignedObjective(aligned);
        } else {
            obj.setAlignedObjective(null);
        }

        return obj;
    }

    private OkrObjectiveDTO.Response toResponse(OkrObjective o) {
        return OkrObjectiveDTO.Response.builder()
                .id(o.getId())
                .publicId(o.getPublicId())
                .cycleId(o.getCycleId())
                .ownerEmployeeId(o.getOwnerEmployeeId())
                .ownerTeamId(o.getOwnerTeamId())
                .parentObjectiveId(o.getParentObjective() != null ? o.getParentObjective().getId() : null)
                .alignedObjectiveId(o.getAlignedObjective() != null ? o.getAlignedObjective().getId() : null)
                .objectiveTitle(o.getObjectiveTitle())
                .objectiveDescription(o.getObjectiveDescription())
                .objectiveScope(o.getObjectiveScope())
                .objectiveType(o.getObjectiveType())
                .goalCategory(o.getGoalCategory())
                .successCriteria(o.getSuccessCriteria())
                .status(o.getStatus())
                .progressPct(o.getProgressPct())
                .confidenceScore(o.getConfidenceScore())
                .scoringMethod(o.getScoringMethod())
                .checkInFrequency(o.getCheckInFrequency())
                .startDate(o.getStartDate())
                .dueDate(o.getDueDate())
                .versionNo(o.getVersionNo())
                .isActive(o.getIsActive())
                .deletedAt(o.getDeletedAt())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .createdBy(o.getCreatedBy())
                .updatedBy(o.getUpdatedBy())
                .meta(o.getMeta())
                .build();
    }
}
