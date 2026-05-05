package com.nexora.repository;

import com.nexora.entity.User;
import com.nexora.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // =========================
    // 🔐 AUTH
    // =========================

    // Find by email (Login)
    Optional<User> findByEmail(String email);

    // Check duplicate email (Register)
    boolean existsByEmail(String email);

    // =========================
    // 👨‍💼 ADMIN SUPPORT
    // =========================

    // Get all admins
    List<User> findByRole(Role role);

    // Get only active users
    List<User> findByIsActiveTrue();

    // Get only non-locked users
    List<User> findByIsLockedFalse();

    // Get all active + non-locked users
    List<User> findByIsActiveTrueAndIsLockedFalse();

    // =========================
    // 🚫 USER MANAGEMENT
    // =========================

    // Count locked users (for admin dashboard stats)
    long countByIsLockedTrue();

    // Count active users
    long countByIsActiveTrue();

    // =========================
    // 📊 LEADERBOARD
    // =========================

    // Top 10 developers
    List<User> findTop10ByOrderByDevScoreDesc();

    // Rank calculation
    long countByDevScoreGreaterThan(Integer devScore);

    // Suggested developers (exclude current user)
    List<User> findByIdNotOrderByDevScoreDesc(Long id);

}