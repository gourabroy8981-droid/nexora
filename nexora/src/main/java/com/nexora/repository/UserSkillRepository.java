package com.nexora.repository;

import com.nexora.entity.UserSkill;
import com.nexora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    Optional<UserSkill> findByUserIdAndSkillId(Long userId, Long skillId);
}
