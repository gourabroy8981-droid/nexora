package com.nexora.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer devScore;
    private String badge;
    private boolean active;
    private boolean locked;
}