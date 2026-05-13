package com.example.game_platform.dto;

import lombok.*;

// DTO for leaderboard entry information
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntryDTO {

    private Long id;
    private String username;
    private String avatarUrl;
    private String role;
    private Integer totalScore;
    private Integer xp;
    private Integer level;
    private String badge;
}
