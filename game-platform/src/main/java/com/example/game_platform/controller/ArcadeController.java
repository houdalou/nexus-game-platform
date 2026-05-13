package com.example.game_platform.controller;

import com.example.game_platform.entity.Score;
import com.example.game_platform.service.ScoreService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arcade")
public class ArcadeController {

    private final ScoreService scoreService;

    public ArcadeController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping("/score")
    public Score submitScore(
            @RequestParam int points,
            @RequestParam String gameType,
            Authentication authentication
    ) {
        String username = authentication.getName();
        return scoreService.saveArcadeScore(username, points, gameType);
    }
}
