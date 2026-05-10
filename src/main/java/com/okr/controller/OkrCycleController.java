package com.okr.controller;

import com.okr.dto.request.CycleRequest;
import com.okr.dto.response.ApiResponse;
import com.okr.dto.response.CycleResponse;
import com.okr.service.OkrCycleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cycles")
@RequiredArgsConstructor
public class OkrCycleController {

    private final OkrCycleService cycleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CycleResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(cycleService.getAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CycleResponse>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(cycleService.getActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CycleResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(cycleService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CycleResponse>> create(@Valid @RequestBody CycleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(cycleService.create(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CycleResponse>> update(
            @PathVariable Integer id, @Valid @RequestBody CycleRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cycle updated", cycleService.update(id, request)));
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<Void>> lock(@PathVariable Integer id) {
        cycleService.lock(id);
        return ResponseEntity.ok(ApiResponse.success("Cycle locked", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        cycleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Cycle deleted", null));
    }
}
