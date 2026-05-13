package com.example.game_platform.controller;

import com.example.game_platform.dto.AdminUserDTO;
import com.example.game_platform.dto.UpdateUserDTO;
import com.example.game_platform.dto.UserProfileDTO;
import com.example.game_platform.dto.UserStatsDTO;
import com.example.game_platform.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor to inject UserService dependency
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // CURRENT USER ENDPOINTS
    // =========================
    
    // Get current authenticated user information
    @GetMapping("/me")
    public AdminUserDTO getMe(Authentication auth) {
        return userService.getCurrentUser(auth);
    }

    // Get current user profile with statistics
    @GetMapping("/profile")
    public UserProfileDTO getProfile(Authentication auth) {
        return userService.getCurrentProfile(auth);
    }

    // Update current user profile
    @PutMapping("/me")
    public AdminUserDTO updateMyProfile(Authentication auth, @RequestBody UpdateUserDTO dto) {
        return userService.updateMyProfile(auth, dto);
    }

    // =========================
    // ADMIN USER MANAGEMENT ENDPOINTS
    // =========================
    
    // Get all users (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get specific user by ID (admin only)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Get user statistics by ID (admin only)
    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public UserStatsDTO getUserStats(@PathVariable Long id) {
        return userService.getUserStats(id);
    }

    // Update user by ID (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO adminUpdateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto, Authentication auth) {
        return userService.adminUpdateUser(id, dto, auth.getName());
    }

    // Delete user by ID (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id, Authentication auth) {
        userService.deleteUser(id, auth.getName());
    }

    // Ban user by ID (admin only)
    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO banUser(@PathVariable Long id, Authentication auth) {
        return userService.banUser(id, auth.getName());
    }

    // Unban user by ID (admin only)
    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO unbanUser(@PathVariable Long id, Authentication auth) {
        return userService.unbanUser(id, auth.getName());
    }

    // Reset user password by ID (admin only)
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO resetPassword(@PathVariable Long id, @RequestParam String password, Authentication auth) {
        return userService.resetPassword(id, password, auth.getName());
    }
}