package com.nexora.config;

import com.nexora.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "nexoraSecretKeynexoraSecretKeynexoraSecretKey";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // =========================
    // 🔐 GENERATE TOKEN (WITH ROLE)
    // =========================
    public String generateToken(User user) {

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name()) // ✅ role added
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // 🔁 OPTIONAL OLD METHOD
    // =========================
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // 🔎 EXTRACT EMAIL
    // =========================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =========================
    // 🆕 EXTRACT ROLE (SAFE)
    // =========================
    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        Object role = claims.get("role");
        return role != null ? role.toString() : null;
    }

    // =========================
    // 🔐 VALIDATE TOKEN (IMPROVED)
    // =========================
    public boolean validateToken(String token, UserDetails userDetails) {

        try {
            final String email = extractUsername(token);
            return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    // =========================
    // ⏱️ CHECK EXPIRATION
    // =========================
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // =========================
    // 📦 EXTRACT CLAIMS (SAFE FIX)
    // =========================
    private Claims extractAllClaims(String token) {

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token");
        }
    }
}