package com.nexora.controller;

import com.nexora.entity.Activity;
import com.nexora.entity.User;
import com.nexora.repository.ActivityRepository;
import com.nexora.repository.FollowRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Activity>> getFeed() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 Get followed users
        List<Long> actorIds = followRepository.findFollowingUserIds(user.getId());

        // 🔥 Include self activity
        actorIds.add(user.getId());

        return ResponseEntity.ok(
                activityRepository.findByActorIdInOrderByCreatedAtDesc(actorIds)
        );
    }
}