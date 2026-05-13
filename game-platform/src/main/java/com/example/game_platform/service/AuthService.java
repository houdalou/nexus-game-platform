package com.example.game_platform.service;

import com.example.game_platform.dto.RegisterRequest;
import com.example.game_platform.dto.LoginRequest;
import com.example.game_platform.dto.AuthResponse;
import com.example.game_platform.entity.User;
import com.example.game_platform.entity.Role;
import com.example.game_platform.repository.UserRepository;
import com.example.game_platform.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtService jwtService) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================
    public AuthResponse register(RegisterRequest request) {

        if (repo.findByUsername(request.getUsername()).isPresent()) {
            return new AuthResponse(null, "Username already exists");
        }

        if (repo.findByEmail(request.getEmail()).isPresent()) {
            return new AuthResponse(null, "Email already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setAvatarUrl(request.getAvatarUrl());
        user.setRole(Role.USER);
        user.setTotalScore(0);

        repo.save(user);

        return new AuthResponse(null, "User registered successfully");
    }

    // ================= LOGIN =================
    public AuthResponse login(LoginRequest request) {

        User user = repo.findByUsername(request.getUsername())
                .or(() -> repo.findByEmail(request.getUsername()))
                .orElse(null);

        if (user == null) {
            return new AuthResponse(null, "User not found");
        }

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(null, "Wrong password");
        }

        // ✅ pass both username and role
        String token = jwtService.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(token, "Login successful");
    }
}