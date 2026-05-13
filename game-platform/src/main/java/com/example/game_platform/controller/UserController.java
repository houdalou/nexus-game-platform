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

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // � CURRENT USER
    // =========================
    @GetMapping("/me")
    public AdminUserDTO getMe(Authentication auth) {
        return userService.getCurrentUser(auth);
    }

    @GetMapping("/profile")
    public UserProfileDTO getProfile(Authentication auth) {
        return userService.getCurrentProfile(auth);
    }

    @PutMapping("/me")
    public AdminUserDTO updateMyProfile(Authentication auth, @RequestBody UpdateUserDTO dto) {
        return userService.updateMyProfile(auth, dto);
    }

    // =========================
    // 👥 ADMIN USER MANAGEMENT
    // =========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public UserStatsDTO getUserStats(@PathVariable Long id) {
        return userService.getUserStats(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO adminUpdateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto, Authentication auth) {
        return userService.adminUpdateUser(id, dto, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id, Authentication auth) {
        userService.deleteUser(id, auth.getName());
    }

    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO banUser(@PathVariable Long id, Authentication auth) {
        return userService.banUser(id, auth.getName());
    }

    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO unbanUser(@PathVariable Long id, Authentication auth) {
        return userService.unbanUser(id, auth.getName());
    }

    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO resetPassword(@PathVariable Long id, @RequestParam String password, Authentication auth) {
        return userService.resetPassword(id, password, auth.getName());
    }
}