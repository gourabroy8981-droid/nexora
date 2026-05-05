package com.nexora.config;

import com.nexora.entity.Role;
import com.nexora.entity.User;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository repo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {

        if (repo.findByEmail("admin@nexora.com").isEmpty()) {

            User admin = User.builder()
                    .name("Admin")
                    .email("admin@nexora.com")
                    .password(encoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .isLocked(false)
                    .build();

            repo.save(admin);

            System.out.println("✅ Admin created!");
        }
    }
}