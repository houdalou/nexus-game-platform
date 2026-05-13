package com.example.game_platform.service;

import com.example.game_platform.dto.*;
import com.example.game_platform.entity.Role;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    // Constructor to inject dependencies
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    // =========================
    // MAPPERS
    // =========================
    
    // Map User entity to AdminUserDTO
    private AdminUserDTO mapToAdminDTO(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .totalScore(user.getTotalScore())
                .xp(user.getXp())
                .level(user.getLevel())
                .badge(user.getBadge())
                .banned(user.getBanned())
                .build();
    }

    // Map User entity to UserStatsDTO
    private UserStatsDTO mapToStatsDTO(User user) {
        return UserStatsDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .totalScore(user.getTotalScore())
                .xp(user.getXp())
                .level(user.getLevel())
                .badge(user.getBadge())
                .banned(user.getBanned())
                .build();
    }

    // Map User entity to TopPlayerDTO
    private TopPlayerDTO mapToTopPlayer(User user) {
        return TopPlayerDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .totalScore(user.getTotalScore())
                .level(user.getLevel())
                .badge(user.getBadge())
                .build();
    }

    // =========================
    // CURRENT USER OPERATIONS
    // =========================
    
    // Get current authenticated user information
    public AdminUserDTO getCurrentUser(Authentication auth) {
        User user = findByUsername(auth.getName());
        return mapToAdminDTO(user);
    }

    // Get current authenticated user profile
    public UserProfileDTO getCurrentProfile(Authentication auth) {
        User user = findByUsername(auth.getName());
        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .totalScore(user.getTotalScore())
                .badge(user.getBadge())
                .build();
    }

    // Update current authenticated user profile
    public AdminUserDTO updateMyProfile(Authentication auth, UpdateUserDTO dto) {
        User user = findByUsername(auth.getName());
        applyUpdates(user, dto);
        User saved = userRepository.save(user);
        return mapToAdminDTO(saved);
    }

    // =========================
    // ADMIN USER MANAGEMENT OPERATIONS
    // =========================
    
    // Get all users (admin only)
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToAdminDTO)
                .toList();
    }

    // Get user by ID (admin only)
    public AdminUserDTO getUserById(Long id) {
        User user = findById(id);
        return mapToAdminDTO(user);
    }

    // Get user statistics by ID (admin only)
    public UserStatsDTO getUserStats(Long id) {
        User user = findById(id);
        return mapToStatsDTO(user);
    }

    // Update user by ID (admin only)
    public AdminUserDTO adminUpdateUser(Long id, UpdateUserDTO dto, String adminUsername) {
        User user = findById(id);
        applyUpdates(user, dto);
        User saved = userRepository.save(user);
        auditLogService.logAction(adminUsername, "USER_UPDATED", user.getUsername(), "Admin updated user profile");
        return mapToAdminDTO(saved);
    }

    // Delete user by ID (admin only)
    public void deleteUser(Long id, String adminUsername) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        User user = findById(id);
        String username = user.getUsername();
        userRepository.deleteById(id);
        auditLogService.logAction(adminUsername, "USER_DELETED", username, "Admin deleted user");
    }

    // Ban user by ID (admin only)
    public AdminUserDTO banUser(Long id, String adminUsername) {
        User user = findById(id);
        user.setBanned(true);
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "BAN_USER", user.getUsername(), "Admin banned user");
        return mapToAdminDTO(user);
    }

    // Unban user by ID (admin only)
    public AdminUserDTO unbanUser(Long id, String adminUsername) {
        User user = findById(id);
        user.setBanned(false);
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "UNBAN_USER", user.getUsername(), "Admin unbanned user");
        return mapToAdminDTO(user);
    }

    // Reset user password by ID (admin only)
    public AdminUserDTO resetPassword(Long id, String newPassword, String adminUsername) {
        User user = findById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "RESET_PASSWORD", user.getUsername(), "Admin reset user password");
        return mapToAdminDTO(user);
    }

    // Get top players by score
    public List<TopPlayerDTO> getTopPlayers(int limit) {
        return userRepository.findTop10ByOrderByTotalScoreDesc()
                .stream()
                .limit(limit)
                .map(this::mapToTopPlayer)
                .toList();
    }

    // =========================
    // HELPER METHODS
    // =========================
    
    // Find user by username or throw exception
    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Find user by ID or throw exception
    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Apply updates from DTO to user entity
    private void applyUpdates(User user, UpdateUserDTO dto) {
        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            user.setUsername(dto.getUsername());
        }
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getAvatarUrl() != null && !dto.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
    }
}
