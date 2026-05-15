package com.okr.controller;

import com.okr.dto.response.ApiResponse;
import com.okr.dto.response.EmployeeResponse;
import com.okr.entity.Employee;
import com.okr.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> getAll() {
        List<EmployeeResponse> employees = employeeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(employees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable Integer id) {
        return employeeRepository.findById(id)
                .map(e -> ResponseEntity.ok(ApiResponse.success(toResponse(e))))
                .orElse(ResponseEntity.notFound().build());
    }

    private EmployeeResponse toResponse(Employee e) {
        String fullName = ((e.getFirstName() != null ? e.getFirstName() : "") + " "
                + (e.getLastName() != null ? e.getLastName() : "")).trim();
        if (fullName.isEmpty() && e.getName() != null) fullName = e.getName();

        return EmployeeResponse.builder()
                .id(e.getId())
                .name(fullName.isEmpty() ? e.getEmail() : fullName)
                .email(e.getEmail())
                .designation(e.getDesignation())
                .department(e.getDepartment())
                .build();
    }
}
