package com.nexora.repository;

import com.nexora.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByReceiverEmailOrderByCreatedAtDesc(String email);

    long countByReceiverEmailAndIsReadFalse(String email);
}