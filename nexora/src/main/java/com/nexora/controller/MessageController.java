package com.nexora.controller;

import com.nexora.entity.Message;
import com.nexora.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageRepository messageRepository;

    @GetMapping("/chat/{senderId}/{receiverId}")
    public List<Message> getChat(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {

        return messageRepository.findChatMessages(senderId, receiverId);
    }
}