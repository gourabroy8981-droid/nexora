package com.nexora.controller;

import com.nexora.dto.ChatMessage;
import com.nexora.entity.Message;
import com.nexora.entity.User;
import com.nexora.repository.MessageRepository;
import com.nexora.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // =========================
    // ✅ FETCH OLD MESSAGES
    // =========================
    @GetMapping("/messages/{user1}/{user2}")
    public List<ChatMessage> getChatMessages(
            @PathVariable Long user1,
            @PathVariable Long user2) {

        return messageRepository.findChatMessages(user1, user2)
                .stream()
                .map(msg -> ChatMessage.builder()
                        .id(msg.getId())
                        .senderId(msg.getSender().getId())
                        .receiverId(msg.getReceiver().getId())
                        .content(msg.getContent())
                        .timestamp(msg.getTimestamp())
                        .seen(msg.isSeen())
                        .build()
                )
                .toList();
    }

    // =========================
    // 📩 SEND MESSAGE
    // =========================
    @MessageMapping("/private-message")
    @Transactional
    public void sendPrivateMessage(@Payload ChatMessage message) {

        System.out.println("📩 MESSAGE RECEIVED: " + message);

        if (message == null ||
                message.getSenderId() == null ||
                message.getReceiverId() == null) {
            return;
        }

        User sender = userRepository.findById(message.getSenderId()).orElse(null);
        User receiver = userRepository.findById(message.getReceiverId()).orElse(null);

        if (sender == null || receiver == null) return;

        Message entity = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(message.getContent())
                .timestamp(LocalDateTime.now())
                .seen(false)
                .build();

        Message saved = messageRepository.save(entity);

        ChatMessage response = ChatMessage.builder()
                .id(saved.getId())
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .content(saved.getContent())
                .timestamp(saved.getTimestamp())
                .seen(saved.isSeen())
                .build();

        messagingTemplate.convertAndSend("/topic/private/" + receiver.getId(), response);
        messagingTemplate.convertAndSend("/topic/private/" + sender.getId(), response);
    }

    // =========================
    // 👁 SEEN (FINAL FIX)
    // =========================
    @MessageMapping("/seen")
    @Transactional
    public void markAsSeen(@Payload Map<String, Object> payload) {

        System.out.println("🔥 SEEN EVENT RECEIVED: " + payload);

        try {
            Long senderId = Long.valueOf(payload.get("senderId").toString());
            Long receiverId = Long.valueOf(payload.get("receiverId").toString());

            // ✅ Update DB
            List<Message> messages = messageRepository
                    .findBySender_IdAndReceiver_IdAndSeenFalse(senderId, receiverId);

            for (Message msg : messages) {
                msg.setSeen(true);
            }

            messageRepository.saveAll(messages);

            // ✅ Create event
            ChatMessage seenEvent = ChatMessage.builder()
                    .senderId(senderId)
                    .receiverId(receiverId)
                    .seen(true)
                    .content(null)
                    .build();

            System.out.println("📤 SENDING SEEN EVENT");

            // 🔥 Send to BOTH (guaranteed delivery)
            messagingTemplate.convertAndSend("/topic/private/" + senderId, seenEvent);
            messagingTemplate.convertAndSend("/topic/private/" + receiverId, seenEvent);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // =========================
    // ✍️ TYPING
    // =========================
    @MessageMapping("/typing")
    public void typing(@Payload String username) {
        messagingTemplate.convertAndSend("/topic/typing", username);
    }

    // =========================
    // 🟢 USER JOINED
    // =========================
    @MessageMapping("/user-joined")
    public void userJoined(@Payload String username) {
        messagingTemplate.convertAndSend("/topic/user-joined", username);
    }

    // =========================
    // 🔴 USER LEFT
    // =========================
    @MessageMapping("/user-left")
    public void userLeft(@Payload String username) {
        messagingTemplate.convertAndSend("/topic/user-left", username);
    }
}