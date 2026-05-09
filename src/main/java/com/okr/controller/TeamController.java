package com.okr.controller;

import com.okr.dto.ApiResponse;
import com.okr.dto.TeamDTO;
import com.okr.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    // POST /api/v1/teams
    @PostMapping
    public ResponseEntity<ApiResponse<TeamDTO.Response>> create(
            @Valid @RequestBody TeamDTO.Request request) {
        TeamDTO.Response response = teamService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Team created successfully", response));
    }

    // GET /api/v1/teams
    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDTO.Response>>> getAll(
            @RequestParam(required = false) String search) {
        List<TeamDTO.Response> data = (search != null && !search.isBlank())
                ? teamService.searchByName(search)
                : teamService.getAll();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // GET /api/v1/teams/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDTO.Response>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getById(id)));
    }

    // PUT /api/v1/teams/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeamDTO.Response>> update(
            @PathVariable Integer id,
            @Valid @RequestBody TeamDTO.Request request) {
        return ResponseEntity.ok(
                ApiResponse.success("Team updated successfully", teamService.update(id, request)));
    }

    // DELETE /api/v1/teams/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        teamService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Team deleted successfully", null));
    }
}
