package com.nexora.dto;

import lombok.Data;

@Data
public class ProjectRequest {

    private String title;
    private String description;
    private String techStack;
    private String githubLink;
    private String liveDemoLink;
}
