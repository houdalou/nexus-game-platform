package com.example.game_platform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsDTO {

    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String role;
    private Integer totalScore;
    private Integer xp;
    private Integer level;
    private String badge;
    private Boolean banned;
}
