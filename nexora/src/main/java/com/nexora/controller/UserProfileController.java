package com.nexora.controller;

import com.nexora.dto.*;
import com.nexora.entity.User;
import com.nexora.repository.UserRepository;
import com.nexora.service.DevScoreService;
import com.nexora.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final DevScoreService devScoreService;
    private final UserService userService;

    // =========================
    // LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        LoginResponse response = userService.login(request);

        return ResponseEntity.ok(response);
    }

    // =========================
    // Update DevScore
    // =========================
    @PostMapping("/{userId}/update-devscore")
    public ResponseEntity<?> updateDevScore(@PathVariable Long userId) {

        int score = devScoreService.getDevScore(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "DevScore fetched successfully");
        response.put("devScore", score);

        return ResponseEntity.ok(response);
    }

    // =========================
    // Follow User
    // =========================
    @PostMapping("/{followerId}/follow/{followingId}")
    public String followUser(@PathVariable Long followerId,
                             @PathVariable Long followingId) {

        return userService.followUser(followerId, followingId);
    }

    // =========================
    // Leaderboard
    // =========================
    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard() {

        return ResponseEntity.ok(userService.getTopUsers());
    }

    // =========================
    // Recalculate Badge
    // =========================
    @PostMapping("/{userId}/recalculate-badge")
    public ResponseEntity<String> recalculateBadge(@PathVariable Long userId) {

        devScoreService.recalculateBadge(userId);

        return ResponseEntity.ok("Badge recalculated successfully");
    }

    // =========================
    // Get Profile
    // =========================
    @GetMapping("/{userId}/profile")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable Long userId) {

        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    // =========================
    // Get Profile by Email
    // =========================
    @GetMapping("/email/{email}")
    public ResponseEntity<ProfileResponse> getProfileByEmail(@PathVariable String email) {

        return ResponseEntity.ok(userService.getUserProfileByEmail(email));
    }

    // =========================
    // Unfollow User
    // =========================
    @DeleteMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<String> unfollowUser(
            @PathVariable Long followerId,
            @PathVariable Long followingId) {

        return ResponseEntity.ok(
                userService.unfollowUser(followerId, followingId)
        );
    }

    // =========================
    // Suggested Developers
    // =========================
    @GetMapping("/{userId}/suggested")
    public ResponseEntity<List<SuggestedUserResponse>> getSuggestedDevelopers(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userService.getSuggestedDevelopers(userId)
        );
    }

    // =========================
    // Update Profile ✅ FIXED HERE ONLY
    // =========================
    // =========================
// Update Profile ✅ FIXED HERE ONLY
// =========================
    @PutMapping(value = "/profile", consumes = "multipart/form-data")
    public ResponseEntity<String> updateProfile(
            @RequestParam(value = "mobile", required = false) String mobile,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(
                userService.updateProfile(mobile, bio, file)
        );
    }
    // =========================
    // Get All Users (FOR CHAT)
    // =========================
    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


}