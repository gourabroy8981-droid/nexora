package com.nexora.repository;

import com.nexora.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    // ✅ Feed query (LinkedIn style)
    List<Activity> findByActorIdInOrderByCreatedAtDesc(List<Long> actorIds);

    // ✅ Optional → User profile activity
    List<Activity> findByActorIdOrderByCreatedAtDesc(Long actorId);
}