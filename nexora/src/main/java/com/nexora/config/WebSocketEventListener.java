package com.nexora.config;

import com.nexora.service.OnlineUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final OnlineUserService onlineUserService;

    @EventListener
    public void handleConnect(SessionConnectEvent event) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        if (accessor.getUser() != null) {

            // ✅ FIX: handle "anonymous" safely
            String username = accessor.getUser().getName();

            if (username == null || username.equals("anonymous")) {
                return;
            }

            Long userId = Long.parseLong(username);

            onlineUserService.userOnline(userId);

            System.out.println("🟢 User ONLINE: " + userId);
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        if (accessor.getUser() != null) {

            // ✅ FIX: handle "anonymous" safely
            String username = accessor.getUser().getName();

            if (username == null || username.equals("anonymous")) {
                return;
            }

            Long userId = Long.parseLong(username);

            onlineUserService.userOffline(userId);

            System.out.println("⚫ User OFFLINE: " + userId);
        }
    }
}