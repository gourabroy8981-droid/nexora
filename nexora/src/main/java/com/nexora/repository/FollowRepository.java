package com.nexora.repository;

import com.nexora.entity.Follow;
import com.nexora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    // ✅ Check if already following
    Optional<Follow> findByFollower_IdAndFollowing_Id(Long followerId, Long followingId);

    // ✅ Count followers of a user
    long countByFollowing_Id(Long userId);

    // ✅ Count following of a user
    long countByFollower_Id(Long userId);

    // ✅ Get all users this user follows
    List<Follow> findByFollower_Id(Long followerId);

    // ✅ Get all followers of a user
    List<Follow> findByFollowing_Id(Long followingId);

    // 🔥 NEW — Required for Activity Feed
    @Query("SELECT f.following.id FROM Follow f WHERE f.follower.id = :userId")
    List<Long> findFollowingUserIds(Long userId);

    boolean existsByFollowerAndFollowing(User follower, User following);
}