package com.example.game_platform.dto;

import lombok.*;

// DTO for game information
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer xpReward;
    private String imageUrl;
    private String slug;
    private Boolean enabled;
}
