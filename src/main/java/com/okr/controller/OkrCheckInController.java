package com.okr.controller;

import com.okr.dto.request.CheckInRequest;
import com.okr.dto.response.ApiResponse;
import com.okr.dto.response.CheckInResponse;
import com.okr.service.OkrCheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OkrCheckInController {

    private final OkrCheckInService checkInService;

    // Get all check-ins for an objective (timeline)
    @GetMapping("/objectives/{objectiveId}/check-ins")
    public ResponseEntity<ApiResponse<List<CheckInResponse>>> getByObjective(
            @PathVariable Integer objectiveId) {
        return ResponseEntity.ok(ApiResponse.success(checkInService.getByObjective(objectiveId)));
    }

    // Get check-ins for a specific key result
    @GetMapping("/key-results/{keyResultId}/check-ins")
    public ResponseEntity<ApiResponse<List<CheckInResponse>>> getByKeyResult(
            @PathVariable Integer keyResultId) {
        return ResponseEntity.ok(ApiResponse.success(checkInService.getByKeyResult(keyResultId)));
    }

    @GetMapping("/check-ins/{id}")
    public ResponseEntity<ApiResponse<CheckInResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(checkInService.getById(id)));
    }

    @PostMapping("/check-ins")
    public ResponseEntity<ApiResponse<CheckInResponse>> create(
            @Valid @RequestBody CheckInRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(checkInService.create(request)));
    }

    @PutMapping("/check-ins/{id}")
    public ResponseEntity<ApiResponse<CheckInResponse>> update(
            @PathVariable Integer id, @Valid @RequestBody CheckInRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Check-in updated", checkInService.update(id, request)));
    }

    @DeleteMapping("/check-ins/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        checkInService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Check-in deleted", null));
    }
}
