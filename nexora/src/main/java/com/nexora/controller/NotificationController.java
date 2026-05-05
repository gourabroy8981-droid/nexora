package com.nexora.controller;

import com.nexora.entity.Notification;
import com.nexora.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 🔔 Get notifications of logged-in user
    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getCurrentUserNotifications();
    }

    // 🔔 Get unread count of logged-in user
    @GetMapping("/unread-count")
    public long getUnreadCount() {
        return notificationService.getCurrentUserUnreadCount();
    }

    // 🔔 Mark notification as read
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
}