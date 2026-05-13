package com.example.game_platform.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalStatsDTO {

    private long totalUsers;
    private long activeUsers;
    private long totalGames;
    private long totalScores;
    private List<TopPlayerDTO> topPlayers;
    private List<PopularGameDTO> popularGames;
    private double averageScore;
}
