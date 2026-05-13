package com.example.game_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// DTO for authentication response containing token and message
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
}