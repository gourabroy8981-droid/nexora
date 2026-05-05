package com.nexora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String title;
    private String description;
    private String techStack;
    private String githubLink;
    private String liveDemoLink;
    private int likeCount;

    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String image;
}