package com.example.game_platform.repository;

import com.example.game_platform.entity.QuizSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizSessionRepository extends JpaRepository<QuizSession, Long> {
    List<QuizSession> findByUser_UsernameOrderByEndTimeDesc(String username);
}