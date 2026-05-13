package com.example.game_platform.service;

import com.example.game_platform.dto.LeaderboardEntryDTO;
import com.example.game_platform.entity.*;
import com.example.game_platform.repository.ScoreRepository;
import com.example.game_platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepo;
    private final UserRepository userRepo;

    // Constructor to inject dependencies
    public ScoreService(ScoreRepository scoreRepo, UserRepository userRepo) {
        this.scoreRepo = scoreRepo;
        this.userRepo = userRepo;
    }

    // Main game score saving method with difficulty
    @Transactional
    public Score saveScore(String username, int points, DifficultyLevel difficulty) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Initialize user stats if null (safety check for old data)
        if (user.getTotalScore() == null) user.setTotalScore(0);
        if (user.getXp() == null) user.setXp(0);
        if (user.getLevel() == null) user.setLevel(1);

        // Update total score
        user.setTotalScore(user.getTotalScore() + points);

        // Calculate and add XP based on difficulty
        int xpGained = calculateXp(difficulty);
        user.setXp(user.getXp() + xpGained);

        // Update level based on XP
        user.setLevel(calculateLevel(user.getXp()));

        // Update badge based on XP
        user.setBadge(calculateBadge(user.getXp()));

        // Save user updates
        userRepo.save(user);

        // Create and save score record for history
        Score score = new Score();
        score.setPoints(points);
        score.setUser(user);

        return scoreRepo.save(score);
    }

    // Calculate XP based on difficulty level
    private int calculateXp(DifficultyLevel difficulty) {
        return switch (difficulty) {
            case EASY -> 10;
            case MEDIUM -> 20;
            case HARD -> 40;
        };
    }

    // Calculate level based on XP
    private int calculateLevel(int xp) {
        return (xp / 100) + 1;
    }

    // Calculate badge based on XP
    private String calculateBadge(int xp) {

        if (xp >= 1000) return "DIAMOND";
        if (xp >= 600) return "PLATINUM";
        if (xp >= 300) return "GOLD";
        if (xp >= 100) return "SILVER";
        return "BRONZE";
    }

    // Get top scores for leaderboard
    public List<LeaderboardEntryDTO> getTopScores() {
        return userRepo.findTop10ByOrderByTotalScoreDesc()
                .stream()
                .map(u -> LeaderboardEntryDTO.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .avatarUrl(u.getAvatarUrl())
                        .role(u.getRole().name())
                        .totalScore(u.getTotalScore())
                        .xp(u.getXp())
                        .level(u.getLevel())
                        .badge(u.getBadge())
                        .build())
                .toList();
    }

    // Save score with default medium difficulty
    public Score saveScore(String username, int points) {
        return saveScore(username, points, DifficultyLevel.MEDIUM);
    }

    // Save arcade game score (chess, snake, etc.)
    @Transactional
    public Score saveArcadeScore(String username, int points, String gameType) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTotalScore() == null) user.setTotalScore(0);
        if (user.getXp() == null) user.setXp(0);
        if (user.getLevel() == null) user.setLevel(1);

        user.setTotalScore(user.getTotalScore() + points);
        int xpGained = points / 5; // arcade XP proportional to score
        user.setXp(user.getXp() + xpGained);
        user.setLevel(calculateLevel(user.getXp()));
        user.setBadge(calculateBadge(user.getXp()));
        userRepo.save(user);

        Score score = new Score();
        score.setPoints(points);
        score.setGameType(gameType);
        score.setUser(user);

        return scoreRepo.save(score);
    }
}