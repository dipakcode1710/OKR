package com.okr.controller;

import com.okr.dto.ApiResponse;
import com.okr.dto.OkrObjectiveDTO;
import com.okr.entity.OkrObjective;
import com.okr.service.OkrObjectiveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/objectives")
@RequiredArgsConstructor
public class OkrObjectiveController {

    private final OkrObjectiveService service;

    // ─── CREATE ────────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/objectives
     * Create a new OKR objective.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> create(
            @Valid @RequestBody OkrObjectiveDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Objective created", service.create(request)));
    }

    // ─── READ ──────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/objectives
     * List all non-deleted objectives.
     * Optional filters: cycleId, employeeId, teamId, status
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<OkrObjectiveDTO.Response>>> getAll(
            @RequestParam(required = false) Integer cycleId,
            @RequestParam(required = false) Integer employeeId,
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) OkrObjective.ObjectiveStatus status) {

        List<OkrObjectiveDTO.Response> data;

        if (cycleId != null) {
            data = service.getByCycle(cycleId);
        } else if (employeeId != null) {
            data = service.getByEmployee(employeeId);
        } else if (teamId != null) {
            data = service.getByTeam(teamId);
        } else if (status != null) {
            data = service.getByStatus(status);
        } else {
            data = service.getAll();
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * GET /api/v1/objectives/{id}
     * Get objective by integer ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(service.getById(id)));
    }

    /**
     * GET /api/v1/objectives/public/{publicId}
     * Get objective by UUID public ID.
     */
    @GetMapping("/public/{publicId}")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> getByPublicId(
            @PathVariable String publicId) {
        return ResponseEntity.ok(ApiResponse.success(service.getByPublicId(publicId)));
    }

    /**
     * GET /api/v1/objectives/{id}/children
     * Get child objectives (execution hierarchy).
     */
    @GetMapping("/{id}/children")
    public ResponseEntity<ApiResponse<List<OkrObjectiveDTO.Response>>> getChildren(
            @PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(service.getChildren(id)));
    }

    /**
     * GET /api/v1/objectives/{id}/aligned
     * Get objectives aligned to this one (strategic alignment).
     */
    @GetMapping("/{id}/aligned")
    public ResponseEntity<ApiResponse<List<OkrObjectiveDTO.Response>>> getAligned(
            @PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(service.getAligned(id)));
    }

    // ─── UPDATE ────────────────────────────────────────────────────────────────

    /**
     * PUT /api/v1/objectives/{id}
     * Full update of an objective (bumps version_no).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> update(
            @PathVariable Integer id,
            @Valid @RequestBody OkrObjectiveDTO.Request request) {
        return ResponseEntity.ok(
                ApiResponse.success("Objective updated", service.update(id, request)));
    }

    /**
     * PATCH /api/v1/objectives/{id}/status
     * Update only the status field.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody OkrObjectiveDTO.StatusUpdate request) {
        return ResponseEntity.ok(
                ApiResponse.success("Status updated", service.updateStatus(id, request)));
    }

    /**
     * PATCH /api/v1/objectives/{id}/progress
     * Update progress percentage and optional confidence score.
     */
    @PatchMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> updateProgress(
            @PathVariable Integer id,
            @Valid @RequestBody OkrObjectiveDTO.ProgressUpdate request) {
        return ResponseEntity.ok(
                ApiResponse.success("Progress updated", service.updateProgress(id, request)));
    }

    // ─── DELETE ────────────────────────────────────────────────────────────────

    /**
     * DELETE /api/v1/objectives/{id}
     * Soft delete (sets deleted_at, is_active=false).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable Integer id) {
        service.softDelete(id);
        return ResponseEntity.ok(ApiResponse.success("Objective soft-deleted", null));
    }

    /**
     * DELETE /api/v1/objectives/{id}/hard
     * Permanent (hard) delete from database.
     */
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable Integer id) {
        service.hardDelete(id);
        return ResponseEntity.ok(ApiResponse.success("Objective permanently deleted", null));
    }

    /**
     * PATCH /api/v1/objectives/{id}/restore
     * Restore a soft-deleted objective.
     */
    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<OkrObjectiveDTO.Response>> restore(@PathVariable Integer id) {
        return ResponseEntity.ok(
                ApiResponse.success("Objective restored", service.restore(id)));
    }
}
