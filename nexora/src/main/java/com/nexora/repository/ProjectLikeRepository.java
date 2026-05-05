package com.nexora.repository;

import com.nexora.entity.ProjectLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectLikeRepository extends JpaRepository<ProjectLike, Long> {

    // 🔥 Prevent duplicate likes (correct nested property syntax)
    Optional<ProjectLike> findByUser_IdAndProject_Id(Long userId, Long projectId);

    // 🔥 Count likes for a project
    Long countByProject_Id(Long projectId);

    // 🔥 Count total likes received by a user (for profile stats)
    long countByProject_User_Id(Long userId);
}