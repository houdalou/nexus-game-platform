package com.example.game_platform.service;

import com.example.game_platform.dto.GlobalStatsDTO;
import com.example.game_platform.dto.PopularGameDTO;
import com.example.game_platform.dto.TopPlayerDTO;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatsService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final ScoreRepository scoreRepository;

    public StatsService(UserRepository userRepository,
                        GameRepository gameRepository,
                        ScoreRepository scoreRepository) {
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
        this.scoreRepository = scoreRepository;
    }

    public GlobalStatsDTO getGlobalStats() {
        long totalUsers = userRepository.count();
        long totalGames = gameRepository.count();
        long totalScores = scoreRepository.count();
        long activeUsers = totalUsers; // Could be refined with last-login tracking

        List<TopPlayerDTO> topPlayers = userRepository.findTop10ByOrderByTotalScoreDesc()
                .stream()
                .map(u -> TopPlayerDTO.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .avatarUrl(u.getAvatarUrl())
                        .totalScore(u.getTotalScore())
                        .level(u.getLevel())
                        .badge(u.getBadge())
                        .role(u.getRole().name())
                        .build())
                .limit(10)
                .toList();

        // For now, return all games as popular since we don't have play-count tracking
        List<PopularGameDTO> popularGames = gameRepository.findAll()
                .stream()
                .filter(g -> g.getEnabled() == null || g.getEnabled())
                .map(g -> PopularGameDTO.builder()
                        .id(g.getId())
                        .title(g.getTitle())
                        .category(g.getCategory())
                        .playCount(0L)
                        .build())
                .limit(5)
                .toList();

        double averageScore = totalScores > 0 ? scoreRepository.findAll()
                .stream()
                .mapToInt(s -> s.getPoints())
                .average()
                .orElse(0.0) : 0.0;

        return GlobalStatsDTO.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalGames(totalGames)
                .totalScores(totalScores)
                .topPlayers(topPlayers)
                .popularGames(popularGames)
                .averageScore(averageScore)
                .build();
    }
}
