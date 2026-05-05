package com.nexora.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String bio;
    private String githubLink;
    private String portfolioLink;
}