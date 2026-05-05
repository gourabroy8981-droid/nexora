package com.nexora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SuggestedUserResponse {

    private Long id;
    private String name;
    private Integer devScore;
    private String badge;
}