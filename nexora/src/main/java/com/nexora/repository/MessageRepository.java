package com.nexora.repository;

import com.nexora.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    // =========================
    // ✅ FETCH CHAT HISTORY
    // =========================
    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender.id = :user1 AND m.receiver.id = :user2)
           OR (m.sender.id = :user2 AND m.receiver.id = :user1)
        ORDER BY m.timestamp ASC
    """)
    List<Message> findChatMessages(
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );

    // =========================
    // ✅ UNSEEN MESSAGES
    // =========================
    List<Message> findBySender_IdAndReceiver_IdAndSeenFalse(
            Long senderId,
            Long receiverId
    );

    // =========================
    // 🔥 COUNT UNREAD (FOR BADGE)
    // =========================
    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.receiver.id = :userId
        AND m.seen = false
    """)
    long countUnreadMessages(@Param("userId") Long userId);

    // =========================
    // 🔥 LAST MESSAGE BETWEEN USERS
    // =========================
    @Query("""
        SELECT m FROM Message m
        WHERE (m.sender.id = :user1 AND m.receiver.id = :user2)
           OR (m.sender.id = :user2 AND m.receiver.id = :user1)
        ORDER BY m.timestamp DESC
    """)
    List<Message> findLastMessage(
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );
}