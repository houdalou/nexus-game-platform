package com.example.game_platform.dto;

import lombok.Data;

// DTO for login request containing username and password
@Data
public class LoginRequest {
    private String username;
    private String password;
}