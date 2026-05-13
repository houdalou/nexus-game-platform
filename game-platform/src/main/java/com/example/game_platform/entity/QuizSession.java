package com.example.game_platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Entity representing a quiz session for a user
@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category; // ← add this

    private int score;
    private int correctAnswers;
    private int totalQuestions;
    private int timeLeft;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @ManyToOne
    private User user;
}