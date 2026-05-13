package com.example.game_platform.dto;

import lombok.*;

// DTO for top player information
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopPlayerDTO {

    private Long id;
    private String username;
    private String avatarUrl;
    private Integer totalScore;
    private Integer level;
    private String badge;
    private String role;
}
