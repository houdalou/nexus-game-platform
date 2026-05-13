package com.example.game_platform.controller;

import com.example.game_platform.entity.QuizSession;
import com.example.game_platform.service.QuizService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService service;

    // Constructor to inject QuizService dependency
    public QuizController(QuizService service) {
        this.service = service;
    }

    // Start a new quiz session with specified difficulty
    @PostMapping("/start")
    public Map<String, Object> start(
            @RequestParam String difficulty,
            Authentication authentication
    ) {
        return service.startQuiz(difficulty, authentication.getName());
    }

    // End a quiz session and record results
    @PostMapping("/end")
    public QuizSession end(
            @RequestParam Long sessionId,
            @RequestParam int correctAnswers,
            @RequestParam int timeLeft
    ) {
        return service.endQuiz(sessionId, correctAnswers, timeLeft);
    }
}