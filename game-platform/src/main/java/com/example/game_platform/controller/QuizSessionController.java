package com.example.game_platform.controller;

import com.example.game_platform.entity.QuizSession;
import com.example.game_platform.repository.QuizSessionRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz/sessions")
public class QuizSessionController {

    private final QuizSessionRepository sessionRepo;

    // Constructor to inject QuizSessionRepository dependency
    public QuizSessionController(QuizSessionRepository sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    // Get quiz sessions for the authenticated user
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public List<QuizSession> getMySessions(Authentication authentication) {
        String username = authentication.getName();
        return sessionRepo.findByUser_UsernameOrderByEndTimeDesc(username);
    }
}
