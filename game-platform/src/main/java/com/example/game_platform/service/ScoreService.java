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

    public ScoreService(ScoreRepository scoreRepo, UserRepository userRepo) {
        this.scoreRepo = scoreRepo;
        this.userRepo = userRepo;
    }

    // 🎮 MAIN GAME METHOD
    @Transactional
    public Score saveScore(String username, int points, DifficultyLevel difficulty) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🧠 safety init (only needed if DB has old nulls)
        if (user.getTotalScore() == null) user.setTotalScore(0);
        if (user.getXp() == null) user.setXp(0);
        if (user.getLevel() == null) user.setLevel(1);

        // 🏆 1. SESSION SCORE (quiz result)
        user.setTotalScore(user.getTotalScore() + points);

        // ⚡ 2. XP SYSTEM (progression)
        int xpGained = calculateXp(difficulty);
        user.setXp(user.getXp() + xpGained);

        // 📈 3. LEVEL SYSTEM
        user.setLevel(calculateLevel(user.getXp()));

        // 🏅 4. BADGE SYSTEM (based on XP)
        user.setBadge(calculateBadge(user.getXp()));

        // 💾 save user updates
        userRepo.save(user);

        // 📊 5. SCORE HISTORY (for leaderboard/history)
        Score score = new Score();
        score.setPoints(points);
        score.setUser(user);

        return scoreRepo.save(score);
    }

    // ⚡ XP RULES
    private int calculateXp(DifficultyLevel difficulty) {
        return switch (difficulty) {
            case EASY -> 10;
            case MEDIUM -> 20;
            case HARD -> 40;
        };
    }

    // 📈 LEVEL SYSTEM
    private int calculateLevel(int xp) {
        return (xp / 100) + 1;
    }

    // 🏅 BADGE SYSTEM
    private String calculateBadge(int xp) {

        if (xp >= 1000) return "DIAMOND";
        if (xp >= 600) return "PLATINUM";
        if (xp >= 300) return "GOLD";
        if (xp >= 100) return "SILVER";
        return "BRONZE";
    }

    // 🏆 LEADERBOARD (GLOBAL)
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

    public Score saveScore(String username, int points) {
        return saveScore(username, points, DifficultyLevel.MEDIUM);
    }

    // 🕹️ ARCADE / CHESS SCORE
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