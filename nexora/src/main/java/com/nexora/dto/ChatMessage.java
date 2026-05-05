package com.nexora.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private Long id; // ✅ MUST

    private Long senderId;
    private Long receiverId;
    private String content;

    private LocalDateTime timestamp;
    private boolean seen;
}