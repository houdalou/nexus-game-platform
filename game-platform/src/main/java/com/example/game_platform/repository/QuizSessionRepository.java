package com.example.game_platform.repository;

import com.example.game_platform.entity.QuizSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repository interface for QuizSession entity
public interface QuizSessionRepository extends JpaRepository<QuizSession, Long> {
    
    // Find quiz sessions by username ordered by end time descending
    List<QuizSession> findByUser_UsernameOrderByEndTimeDesc(String username);
}