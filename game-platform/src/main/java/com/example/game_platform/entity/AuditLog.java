package com.example.game_platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String adminUsername;

    @Column(nullable = false)
    private String action; // USER_CREATED, USER_UPDATED, USER_DELETED, GAME_ENABLED, GAME_DISABLED, BAN_USER, UNBAN_USER, RESET_PASSWORD, etc.

    @Column(nullable = false)
    private String target; // username, game id, etc.

    @Column(length = 1000)
    private String details;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
