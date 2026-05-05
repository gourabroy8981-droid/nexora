package com.nexora.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // ✅ PRE-FLIGHT (CORS)
                        // =========================
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // =========================
                        // 🌐 PUBLIC AUTH APIs
                        // =========================
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/users/login",
                                "/api/users/register",

                                // 🔥 ✅ ADD THESE (FIX YOUR ERROR)
                                "/api/users/forgot-password",
                                "/api/users/reset-password",

                                "/error"
                        ).permitAll()

                        // =========================
                        // 📂 STATIC FILES
                        // =========================
                        .requestMatchers("/uploads/**").permitAll()

                        // =========================
                        // 💬 CHAT
                        // =========================
                        .requestMatchers("/api/chat/**").permitAll()

                        // =========================
                        // 🔌 WEBSOCKET
                        // =========================
                        .requestMatchers("/ws/**", "/app/**", "/topic/**").permitAll()

                        // =========================
                        // 👨‍💼 ADMIN ROUTES
                        // =========================
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // =========================
                        // 🔐 EVERYTHING ELSE
                        // =========================
                        .anyRequest().authenticated()
                );

        // =========================
        // 🔐 JWT FILTER
        // =========================
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // =========================
    // 🌐 CORS CONFIG
    // =========================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // =========================
    // 🔐 PASSWORD ENCODER
    // =========================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}