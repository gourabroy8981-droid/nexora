package com.nexora.service;

import com.nexora.entity.Notification;
import com.nexora.entity.User;
import com.nexora.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // 🔔 Create Notification (Follow, Like, etc.)
    public void createNotification(User receiver, String message) {

        Notification notification = Notification.builder()
                .receiver(receiver)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        // ✅ Save to DB
        notificationRepository.save(notification);

        // ✅ Send real-time update via WebSocket
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + receiver.getId(),
                notification
        );
    }

    // 📩 Get Notifications (Secure - logged-in user only)
    public List<Notification> getCurrentUserNotifications() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return notificationRepository
                .findByReceiverEmailOrderByCreatedAtDesc(email);
    }

    // 🔢 Get Unread Count (Secure - logged-in user only)
    public long getCurrentUserUnreadCount() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return notificationRepository
                .countByReceiverEmailAndIsReadFalse(email);
    }

    // ✅ Mark as Read
    public void markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}