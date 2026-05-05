package com.nexora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String techStack;

    private String githubLink;

    private String liveDemoLink;

    private String image;

    // 🔥 Total Likes
    private Integer likeCount = 0;

    private LocalDateTime createdAt;

    // 🔥 Many projects belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 🔥 One project can have many likes
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectLike> likes;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}