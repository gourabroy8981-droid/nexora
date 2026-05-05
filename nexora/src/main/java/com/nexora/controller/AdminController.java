package com.nexora.controller;

import com.nexora.entity.User;
import com.nexora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    // =========================
    // GET ALL USERS (SAFE)
    // =========================
    @GetMapping("/users")
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("name", user.getName());
                    map.put("email", user.getEmail());
                    map.put("role", user.getRole() != null ? user.getRole().name() : null);
                    map.put("devScore", user.getDevScore());
                    map.put("badge", user.getBadge() != null ? user.getBadge().name() : null);
                    map.put("active", user.isActive());
                    map.put("locked", user.isLocked());
                    map.put("deleted", user.isDeleted()); // ✅ include soft-deleted flag
                    return map;
                })
                .collect(Collectors.toList());
    }

    // =========================
    // BLOCK USER
    // =========================
    @PutMapping("/block/{id}")
    public ResponseEntity<String> blockUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.isDeleted()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Cannot block a deleted user!");
                    }
                    user.setLocked(true);
                    userRepository.save(user);
                    return ResponseEntity.ok("User blocked");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    // =========================
    // UNBLOCK USER
    // =========================
    @PutMapping("/unblock/{id}")
    public ResponseEntity<String> unblockUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.isDeleted()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Cannot unblock a deleted user!");
                    }
                    user.setLocked(false);
                    userRepository.save(user);
                    return ResponseEntity.ok("User unblocked");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    // =========================
    // SOFT DELETE USER
    // =========================
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() != null && user.getRole().name().equals("ADMIN")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Admin cannot be deleted!");
                    }
                    if (user.isDeleted()) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("User is already deleted!");
                    }
                    user.setDeleted(true);
                    user.setLocked(true);
                    user.setActive(false);
                    userRepository.save(user);
                    return ResponseEntity.ok("User soft-deleted successfully");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    // =========================
    // HARD DELETE USER
    // =========================
    @DeleteMapping("/user/hard/{id}")
    public ResponseEntity<String> hardDeleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() != null && user.getRole().name().equals("ADMIN")) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Admin cannot be deleted!");
                    }
                    try {
                        userRepository.delete(user); // permanently remove from DB
                        return ResponseEntity.ok("User permanently deleted");
                    } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("Cannot delete user: related data exists!");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }
}