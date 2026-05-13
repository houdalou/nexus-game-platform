package com.example.game_platform.controller;

import com.example.game_platform.dto.LeaderboardEntryDTO;
import com.example.game_platform.entity.Score;
import com.example.game_platform.service.ScoreService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService service;

    public ScoreController(ScoreService service) {
        this.service = service;
    }

    // 🏆 SAVE SCORE (FROM JWT USER)
    @PostMapping
    public Score save(
            @RequestParam int points,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return service.saveScore(username, points);
    }

    // 🏆 LEADERBOARD
    @GetMapping("/leaderboard")
    public List<LeaderboardEntryDTO> leaderboard() {
        return service.getTopScores();
    }
}