package com.nexora.service;

import com.nexora.dto.*;
import com.nexora.entity.Follow;
import com.nexora.entity.Role;
import com.nexora.entity.User;
import com.nexora.repository.FollowRepository;
import com.nexora.repository.ProjectLikeRepository;
import com.nexora.repository.ProjectRepository;
import com.nexora.repository.UserRepository;
import com.nexora.config.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FollowRepository followRepository;
    private final JwtUtil jwtUtil;
    private final DevScoreService devScoreService;
    private final ProjectRepository projectRepository;
    private final ProjectLikeRepository projectLikeRepository;
    private final NotificationService notificationService;


    // =========================
    // Register User
    // =========================
    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered!";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .devScore(0)
                .build();

        userRepository.save(user);

        return "User registered successfully!";
    }

    // =========================
    // Login User
    // =========================
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isLocked()) {
            throw new RuntimeException("Account is locked");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(token, user.getId());
    }

    // =========================
    // 👨‍💼 ADMIN LOGIN
    // =========================
    public LoginResponse adminLogin(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (user.isLocked()) {
            throw new RuntimeException("Account is locked");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Admin only");
        }

        String token = jwtUtil.generateToken(user);

        return new LoginResponse(token, user.getId());
    }

    // =========================
    // Follow User
    // =========================
    public String followUser(Long followerId, Long followingId) {

        if (followerId.equals(followingId)) {
            return "You cannot follow yourself!";
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        if (followRepository
                .findByFollower_IdAndFollowing_Id(followerId, followingId)
                .isPresent()) {
            return "You already follow this user!";
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);

        devScoreService.addPoints(following, 10);

        notificationService.createNotification(
                following,
                follower.getName() + " started following you."
        );

        return "User followed successfully!";
    }

    // =========================
    // Unfollow User
    // =========================
    public String unfollowUser(Long followerId, Long followingId) {

        Follow follow = followRepository
                .findByFollower_IdAndFollowing_Id(followerId, followingId)
                .orElseThrow(() -> new RuntimeException("You are not following this user"));

        followRepository.delete(follow);

        return "User unfollowed successfully!";
    }

    // =========================
    // Leaderboard (SAFE)
    // =========================
    public List<LeaderboardResponse> getTopUsers() {

        List<User> users = userRepository.findTop10ByOrderByDevScoreDesc();
        List<LeaderboardResponse> leaderboard = new ArrayList<>();

        int rank = 1;

        for (User user : users) {

            int score = user.getDevScore() != null ? user.getDevScore() : 0;

            String badge = user.getBadge() != null ? user.getBadge().name() : "NONE";

            leaderboard.add(new LeaderboardResponse(
                    rank++,
                    user.getId(),
                    user.getName(),
                    score,
                    badge
            ));
        }

        return leaderboard;
    }

    // =========================
    // Get User Profile
    // =========================
    public ProfileResponse getUserProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 GET LOGGED-IN USER
        String currentUserEmail = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElse(null);

// 🔥 CHECK FOLLOW STATUS
        boolean isFollowing = false;

        if (currentUser != null) {
            isFollowing = followRepository
                    .existsByFollowerAndFollowing(currentUser, user);
        }

        long higherScores = userRepository.countByDevScoreGreaterThan(user.getDevScore());
        int rank = (int) higherScores + 1;

        long followers = followRepository.countByFollowing_Id(userId);
        long following = followRepository.countByFollower_Id(userId);

        long projectCount = projectRepository.countByUserId(userId);
        long totalLikes = projectLikeRepository.countByProject_User_Id(userId);

        System.out.println("LOGGED-IN EMAIL: " + currentUserEmail);
        System.out.println("CURRENT USER: " + (currentUser != null ? currentUser.getId() : "NULL"));
        System.out.println("TARGET USER: " + userId);
        System.out.println("IS FOLLOWING: " + isFollowing);

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getBio(),
                user.getGithubLink(),
                user.getPortfolioLink(),
                user.getDevScore() != null ? user.getDevScore() : 0,
                user.getBadge() != null ? user.getBadge().name() : "NONE",
                rank,
                followers,
                following,
                projectCount,
                totalLikes,
                user.getMobile(),
                user.getProfileImage(),
                isFollowing // ✅ ADD THIS
        );

    }

    public ProfileResponse getUserProfileByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return getUserProfile(user.getId());
    }

    // =========================
    // Suggested Developers (FIXED)
    // =========================
    public List<SuggestedUserResponse> getSuggestedDevelopers(Long currentUserId) {

        List<Long> followingIds = followRepository
                .findByFollower_Id(currentUserId)
                .stream()
                .filter(f -> f.getFollowing() != null)
                .map(f -> f.getFollowing().getId())
                .toList();

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getId() != null &&
                                !user.getId().equals(currentUserId) &&
                                !followingIds.contains(user.getId()))
                .sorted((u1, u2) ->
                        Integer.compare(
                                u2.getDevScore() != null ? u2.getDevScore() : 0,
                                u1.getDevScore() != null ? u1.getDevScore() : 0
                        )
                )
                .limit(5)
                .map(user -> new SuggestedUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getDevScore() != null ? user.getDevScore() : 0,
                        user.getBadge() != null ? user.getBadge().name() : "NONE"
                ))
                .toList();
    }

    // =========================
// Update Profile
// =========================
    public String updateProfile(String mobile, String bio, MultipartFile file) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // ✅ AUTH CHECK
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Invalid token / user not authenticated");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMobile(mobile != null ? mobile : "");
        user.setBio(bio != null ? bio : "");

        // 🔥 DEBUG LINE (VERY IMPORTANT)
        System.out.println("FILE RECEIVED: " + (file != null ? file.getOriginalFilename() : "NULL"));

        if (file != null && !file.isEmpty()) {
            try {

                // ✅ GET ORIGINAL NAME
                String originalFileName = file.getOriginalFilename();

                // ✅ EXTRACT EXTENSION SAFELY
                String extension = "";
                if (originalFileName != null && originalFileName.contains(".")) {
                    extension = originalFileName.substring(originalFileName.lastIndexOf("."));
                } else {
                    extension = ".jpg"; // fallback
                }

                // ✅ UNIQUE FILE NAME
                String fileName = System.currentTimeMillis() + extension;

                // ✅ UPLOAD DIRECTORY
                String uploadDir = "D:/nexora/nexora/uploads/";

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                // ✅ SAVE FILE
                File destination = new File(uploadDir + fileName);
                file.transferTo(destination);

                System.out.println("FILE SAVED AS: " + fileName);

                // ✅ SAVE IN DB
                user.setProfileImage(fileName);

            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Image upload failed: " + e.getMessage());
            }
        } else {
            System.out.println("NO FILE UPLOADED");
        }

        userRepository.save(user);

        return "Profile updated successfully!";
    }
    // =========================
    // Get All Users
    // =========================
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .devScore(user.getDevScore() != null ? user.getDevScore() : 0)
                        .badge(user.getBadge() != null ? user.getBadge().name() : "NONE")
                        .active(user.isActive())
                        .locked(user.isLocked())
                        .build()
                )
                .toList();
    }
}