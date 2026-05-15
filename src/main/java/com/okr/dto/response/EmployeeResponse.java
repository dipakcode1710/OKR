package com.okr.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponse {

    private Integer id;
    private String name;
    private String email;
    private String designation;
    private String department;
}
