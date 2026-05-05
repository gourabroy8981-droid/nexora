package com.nexora.service;

import com.nexora.dto.UserProfileDto;
import com.nexora.entity.User;
import com.nexora.entity.UserSkill;
import com.nexora.entity.Endorsement;
import com.nexora.repository.UserSkillRepository;
import com.nexora.repository.EndorsementRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final EndorsementRepository endorsementRepository;

    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<UserSkill> skills = userSkillRepository.findByUser(user);

        UserProfileDto dto = new UserProfileDto();
        dto.setName(user.getName());
        dto.setBio(user.getBio());
        dto.setGithubLink(user.getGithubLink());
        dto.setPortfolioLink(user.getPortfolioLink());

        dto.setSkills(skills.stream().map(skill -> {
            UserProfileDto.SkillDto s = new UserProfileDto.SkillDto();
            s.setSkillName(skill.getSkill().getName());
            s.setProficiencyLevel(skill.getProficiencyLevel());
            int endorsements = endorsementRepository.findByUserAndSkill(user, skill.getSkill()).size();
            s.setEndorsements(endorsements);
            return s;
        }).collect(Collectors.toList()));

        return dto;
    }
}