package com.nexora.service;

import com.nexora.entity.Follow;
import com.nexora.entity.User;
import com.nexora.enums.ActivityType;
import com.nexora.repository.FollowRepository;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 🔥 ✅ ADD THIS
    private final ActivityService activityService;

    public void followUser(Long followerId, Long followingId) {

        // ✅ Prevent duplicate follow
        if (followRepository
                .findByFollower_IdAndFollowing_Id(followerId, followingId)
                .isPresent()) {

            System.out.println("⚠ Already following → Ignored");
            return;
        }

        // ✅ Safer DB fetch with clear errors
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        // ✅ Save follow relationship
        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);

        System.out.println("✅ Follow saved → " +
                follower.getEmail() + " → " + following.getEmail());

        // 🔥 ✅ FOLLOW ACTIVITY (THE MAGIC)
        activityService.log(
                follower,
                ActivityType.USER_FOLLOWED,
                following.getId(),
                follower.getName() + " followed " + following.getName()
        );

        // ✅ Create notification
        notificationService.createNotification(
                following,
                follower.getName() + " started following you 🚀"
        );

        System.out.println("✅ Notification triggered");
    }
}