package com.nexora.entity;

import com.nexora.enums.BadgeLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // BASIC INFO
    // =========================
    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 500)
    private String bio;

    private String githubLink;

    private String portfolioLink;

    private String mobile;

    private String profileImage; // store filename

    private String otp;
    private LocalDateTime otpExpiry;

    // =========================
    // 🔐 ROLE (UPDATED)
    // =========================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // =========================
    // 🛡️ SECURITY FIELDS
    // =========================
    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isLocked = false;

    // =========================
    // SOFT DELETE FLAG
    // =========================
    @Column(nullable = false)
    private boolean deleted = false; // false = active, true = soft-deleted

    // =========================
    // 📊 DEV METRICS
    // =========================
    private Integer devScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BadgeLevel badge = BadgeLevel.NONE;

    // =========================
    // ⏱️ TIMESTAMPS
    // =========================
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // =========================
    // 🔗 RELATIONS
    // =========================
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserSkill> skills;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<com.nexora.entity.Endorsement> endorsements;

    // =========================
    // 🔁 AUTO TIMESTAMPS
    // =========================
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();

        if (this.badge == null) {
            this.badge = BadgeLevel.NONE;
        }

        if (this.role == null) {
            this.role = Role.USER; // default role
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}