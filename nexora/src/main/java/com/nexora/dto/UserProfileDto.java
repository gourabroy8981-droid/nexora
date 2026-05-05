package com.nexora.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileDto {
    private String name;
    private String bio;
    private String githubLink;
    private String portfolioLink;
    private List<SkillDto> skills;

    @Data
    public static class SkillDto {
        private String skillName;
        private Integer proficiencyLevel;
        private Integer endorsements;
    }
}
