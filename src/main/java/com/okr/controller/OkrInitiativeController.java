package com.okr.controller;

import com.okr.dto.request.InitiativeRequest;
import com.okr.dto.response.ApiResponse;
import com.okr.dto.response.InitiativeResponse;
import com.okr.service.OkrInitiativeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OkrInitiativeController {

    private final OkrInitiativeService initiativeService;

    @GetMapping("/key-results/{keyResultId}/initiatives")
    public ResponseEntity<ApiResponse<List<InitiativeResponse>>> getByKeyResult(
            @PathVariable Integer keyResultId) {
        return ResponseEntity.ok(ApiResponse.success(initiativeService.getByKeyResult(keyResultId)));
    }

    @GetMapping("/initiatives/{id}")
    public ResponseEntity<ApiResponse<InitiativeResponse>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(initiativeService.getById(id)));
    }

    @PostMapping("/initiatives")
    public ResponseEntity<ApiResponse<InitiativeResponse>> create(
            @Valid @RequestBody InitiativeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(initiativeService.create(request)));
    }

    @PutMapping("/initiatives/{id}")
    public ResponseEntity<ApiResponse<InitiativeResponse>> update(
            @PathVariable Integer id, @Valid @RequestBody InitiativeRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Initiative updated", initiativeService.update(id, request)));
    }

    @DeleteMapping("/initiatives/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        initiativeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Initiative deleted", null));
    }
}
