package com.nexora.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "project_id"})
})
public class ProjectLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who liked
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Project that was liked
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}