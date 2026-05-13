package com.example.game_platform.dto;

import lombok.*;

// DTO for user profile information
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {

    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private int totalScore;
    private String badge;
}