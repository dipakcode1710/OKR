package com.okr.controller;

import com.okr.dto.request.KeyResultRequest;
import com.okr.dto.request.ProgressUpdateRequest;
import com.okr.dto.response.ApiResponse;
import com.okr.dto.response.KeyResultResponse;
import com.okr.service.OkrKeyResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OkrKeyResultController {

    private final OkrKeyResultService keyResultService;

    // Nested under objective for listing
    @GetMapping("/objectives/{objectiveId}/key-results")
    public ResponseEntity<ApiResponse<List<KeyResultResponse>>> getByObjective(
            @PathVariable Integer objectiveId) {
        return ResponseEntity.ok(ApiResponse.success(keyResultService.getByObjective(objectiveId)));
    }

    @GetMapping("/key-results/{id}")
    public ResponseEntity<ApiResponse<KeyResultResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(keyResultService.getById(id)));
    }

    @PostMapping("/key-results")
    public ResponseEntity<ApiResponse<KeyResultResponse>> create(
            @Valid @RequestBody KeyResultRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(keyResultService.create(request)));
    }

    @PutMapping("/key-results/{id}")
    public ResponseEntity<ApiResponse<KeyResultResponse>> update(
            @PathVariable Integer id, @Valid @RequestBody KeyResultRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Key result updated", keyResultService.update(id, request)));
    }

    /**
     * The main progress update endpoint.
     * Recalculates KR progress and rolls up to parent objective automatically.
     */
    @PatchMapping("/key-results/{id}/progress")
    public ResponseEntity<ApiResponse<KeyResultResponse>> updateProgress(
            @PathVariable Integer id, @Valid @RequestBody ProgressUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Progress updated", keyResultService.updateProgress(id, request)));
    }

    @DeleteMapping("/key-results/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        keyResultService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Key result deleted", null));
    }
}
