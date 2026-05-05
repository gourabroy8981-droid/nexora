package com.nexora.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // follower (who follows)
    @ManyToOne
    @JoinColumn(name = "follower_id")
    private User follower;

    // following (who is being followed)
    @ManyToOne
    @JoinColumn(name = "following_id")
    private User following;
}