package com.nexora.service;

import com.nexora.entity.User;
import com.nexora.enums.BadgeLevel;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DevScoreService {

    private final UserRepository userRepository;

    // 🔹 Add points to a user (MAIN METHOD)
    public void addPoints(User user, int points) {

        int newScore = user.getDevScore() + points;
        user.setDevScore(newScore);

        // 🔥 Auto update badge
        user.setBadge(getBadgeLevel(newScore));

        userRepository.save(user);
    }

    // 🔹 Add points using userId
    public void addPoints(Long userId, int points) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int newScore = user.getDevScore() + points;
        user.setDevScore(newScore);

        // 🔥 Auto update badge
        user.setBadge(getBadgeLevel(newScore));

        userRepository.save(user);
    }

    // 🔹 Get current DevScore
    public int getDevScore(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getDevScore();
    }

    // 🔹 Get Badge Level based on score
    private BadgeLevel getBadgeLevel(int devScore) {

        if (devScore >= 200) {
            return BadgeLevel.GOLD;
        } else if (devScore >= 100) {
            return BadgeLevel.SILVER;
        } else if (devScore >= 50) {
            return BadgeLevel.BRONZE;
        } else {
            return BadgeLevel.NONE;
        }
    }

    // 🔄 Recalculate badge manually (for data correction)
    public void recalculateBadge(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBadge(getBadgeLevel(user.getDevScore()));

        userRepository.save(user);
    }
}