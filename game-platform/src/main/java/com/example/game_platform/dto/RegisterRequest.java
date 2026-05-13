package com.example.game_platform.dto;

import lombok.Data;

// DTO for user registration request
@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String avatarUrl;
}