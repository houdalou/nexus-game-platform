package com.example.game_platform.service;

import com.example.game_platform.entity.*;
import com.example.game_platform.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class QuizService {

    private final QuestionRepository questionRepo;
    private final QuizSessionRepository sessionRepo;
    private final UserRepository userRepo;
    private final ScoreService scoreService;

    // Constructor to inject dependencies
    public QuizService(QuestionRepository questionRepo,
                       QuizSessionRepository sessionRepo,
                       UserRepository userRepo,
                       ScoreService scoreService) {
        this.questionRepo = questionRepo;
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
        this.scoreService = scoreService;
    }

    // Start a new quiz session with specified difficulty
    public Map<String, Object> startQuiz(String difficulty, String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        List<Question> questions = questionRepo.findByDifficulty(difficulty);
        Collections.shuffle(questions);

        QuizSession session = new QuizSession();
        session.setCategory(difficulty);
        session.setUser(user);
        session.setTotalQuestions(questions.size());
        session.setStartTime(LocalDateTime.now());
        sessionRepo.save(session);

        return Map.of(
                "sessionId", session.getId(),
                "questions", questions,
                "difficulty", difficulty
        );
    }

    // End a quiz session and record results
    public QuizSession endQuiz(Long sessionId, int correctAnswers, int timeLeft) {

        QuizSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        int score = (int) (correctAnswers * 10 + timeLeft * 0.5);

        session.setCorrectAnswers(correctAnswers);
        session.setTimeLeft(timeLeft);
        session.setScore(score);
        session.setEndTime(LocalDateTime.now());

        scoreService.saveScore(session.getUser().getUsername(), score);

        return sessionRepo.save(session);
    }
}