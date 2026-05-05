package com.nexora.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "endorsements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Endorsement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // Owner of the skill

    @ManyToOne
    @JoinColumn(name = "endorsed_by")
    private User endorsedBy;  // Who endorsed
}