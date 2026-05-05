package com.nexora.repository;

import com.nexora.entity.Endorsement;
import com.nexora.entity.User;
import com.nexora.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EndorsementRepository extends JpaRepository<Endorsement, Long> {
    List<Endorsement> findByUserAndSkill(User user, Skill skill);
    Optional<Endorsement> findByUserAndSkillAndEndorsedBy(User user, Skill skill, User endorsedBy);
}
