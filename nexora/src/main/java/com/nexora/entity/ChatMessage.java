package com.nexora.entity;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    // ✅ Use IDs instead of names
    private Long senderId;
    private Long receiverId;

    // ✅ Message content
    private String content;

    @Column(name = "is_seen")
    private boolean isSeen = false;
}