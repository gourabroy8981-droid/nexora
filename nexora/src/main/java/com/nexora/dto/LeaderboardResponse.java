package com.nexora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LeaderboardResponse {

    private int rank;
    private Long id;
    private String name;
    private int devScore;
    private String badge;
}