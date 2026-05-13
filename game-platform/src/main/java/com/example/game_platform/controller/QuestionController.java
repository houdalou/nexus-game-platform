package com.example.game_platform.controller;

import com.example.game_platform.entity.Question;
import com.example.game_platform.repository.QuestionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionRepository repo;

    // Constructor to inject QuestionRepository dependency
    public QuestionController(QuestionRepository repo) {
        this.repo = repo;
    }

    // Get all questions (for testing purposes)
    @GetMapping
    public List<Question> getAllQuestions() {
        return repo.findAll();
    }

    // Get questions by category
    @GetMapping("/category/{category}")
    public List<Question> getByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }

    // Add new question (for testing/admin purposes)
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return repo.save(question);
    }

    // Note: Do not put QuizService here
}