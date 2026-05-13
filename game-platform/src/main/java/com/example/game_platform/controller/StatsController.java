package com.example.game_platform.controller;

import com.example.game_platform.dto.GlobalStatsDTO;
import com.example.game_platform.service.StatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    // Constructor to inject StatsService dependency
    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    // Get global platform statistics
    @GetMapping("/global")
    public GlobalStatsDTO getGlobalStats() {
        return statsService.getGlobalStats();
    }
}
