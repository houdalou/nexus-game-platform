package com.example.game_platform.controller;

import com.example.game_platform.entity.Answer;
import com.example.game_platform.repository.AnswerRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/answers")
public class AnswerController {

    private final AnswerRepository repo;

    public AnswerController(AnswerRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Answer add(@RequestBody Answer answer) {
        return repo.save(answer);
    }

    @GetMapping
    public List<Answer> getAll() {
        return repo.findAll();
    }
}