package com.nexora.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class ProfileResponse {

    private Long id;
    private String name;
    private String bio;
    private String githubLink;
    private String portfolioLink;

    private int devScore;
    private String badge;
    private int rank;

    private long followers;
    private long following;
    private long projects;
    private long totalLikesReceived;

    private String mobile;
    private String profileImage;

    private boolean followingUser; // ✅ rename
}