package com.example.game_platform.controller;

import com.example.game_platform.entity.Question;
import com.example.game_platform.repository.QuestionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionRepository repo;

    public QuestionController(QuestionRepository repo) {
        this.repo = repo;
    }

    // 📚 GET ALL QUESTIONS (TEST ONLY)
    @GetMapping
    public List<Question> getAllQuestions() {
        return repo.findAll();
    }

    // 🎯 GET QUESTIONS BY CATEGORY
    @GetMapping("/category/{category}")
    public List<Question> getByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }

    // ➕ ADD QUESTION (TEST / ADMIN TEMP)
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return repo.save(question);
    }

    // ❌ REMOVE THIS (IMPORTANT)
    // DO NOT put QuizService here
}