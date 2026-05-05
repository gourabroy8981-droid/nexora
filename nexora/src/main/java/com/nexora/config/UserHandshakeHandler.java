package com.nexora.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.net.URI;
import java.security.Principal;
import java.util.Map;

public class UserHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {

        try {
            URI uri = request.getURI();
            String query = uri.getQuery();

            if (query == null || query.isEmpty()) {
                System.out.println("❌ No userId found → anonymous");
                return () -> "anonymous";
            }

            String userId = null;

            // ✅ SAFE query parsing
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("userId=")) {
                    String[] keyValue = param.split("=", 2); // 🔥 FIX (safe split)
                    if (keyValue.length > 1) {
                        userId = keyValue[1];
                    }
                    break;
                }
            }

            if (userId == null || userId.trim().isEmpty()) {
                System.out.println("❌ Invalid userId → anonymous");
                return () -> "anonymous";
            }

            final String finalUserId = userId.trim();

            // 🔥 IMPORTANT: store BOTH keys (Spring sometimes uses session attrs)
            attributes.put("userId", finalUserId);
            attributes.put("username", finalUserId); // 🔥 extra safety

            // 🔥 DEBUG LOG
            System.out.println("👤 WebSocket Connected User: " + finalUserId);

            // ✅ STABLE PRINCIPAL (clean + reliable)
            return () -> finalUserId;

        } catch (Exception e) {
            e.printStackTrace();
            return () -> "anonymous";
        }
    }
}