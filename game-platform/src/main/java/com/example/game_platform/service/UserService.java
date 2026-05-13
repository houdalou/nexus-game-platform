package com.example.game_platform.service;

import com.example.game_platform.dto.*;
import com.example.game_platform.entity.Role;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/* ========================================================================
 * SPRING SERVICE VS TRADITIONAL APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING (Traditional Plain Java Approach):
 * 
 * 1. Manual Service Instantiation:
 *    - Would need to manually create service instances
 *    - Example: UserService userService = new UserService();
 *    - Manual dependency management
 *    - Tight coupling between components
 * 
 * 2. Manual Transaction Management:
 *    - Would need to manually begin, commit, or rollback transactions
 *    - Example: Connection conn = dataSource.getConnection(); conn.setAutoCommit(false);
 *    - Manual try-catch blocks for transaction handling
 *    - Risk of resource leaks if not handled properly
 * 
 * 3. Manual Dependency Injection:
 *    - Would need to manually pass dependencies to constructors
 *    - Example: new UserService(userRepository, passwordEncoder, auditLogService);
 *    - Manual dependency graph management
 *    - Difficult to test with mock dependencies
 * 
 * 4. Manual Business Logic Separation:
 *    - Would need to manually separate business logic from presentation
 *    - Risk of business logic leaking into controllers
 *    - No automatic enforcement of layered architecture
 * 
 * 5. Manual Error Handling:
 *    - Would need to manually handle exceptions
 *    - Manual logging and error reporting
 *    - Risk of inconsistent error handling
 * 
 * WITH SPRING:
 * 
 * 1. Automatic Service Registration:
 *    - @Service annotation automatically registers as Spring bean
 *    - Automatic dependency injection via constructor
 *    - Spring manages service lifecycle
 *    - Loose coupling between components
 * 
 * 2. Automatic Transaction Management:
 *    - @Transactional annotation automatically manages transactions
 *    - Automatic commit on success, rollback on exception
 *    - No manual transaction handling needed
 *    - Automatic resource cleanup
 * 
 * 3. Automatic Dependency Injection:
 *    - Constructor injection with @Autowired (implicit)
 *    - Spring automatically provides all dependencies
 *    - Easy testing with mock dependencies
 *    - Clean separation of concerns
 * 
 * 4. Enforced Layered Architecture:
 *    - Services clearly separate business logic from controllers
 *    - Controllers only handle HTTP, services handle logic
 *    - Repositories only handle data access
 *    - Automatic enforcement through Spring DI
 * 
 * 5. Automatic Exception Handling:
 *    - @ControllerAdvice for global exception handling
 *    - Consistent error responses
 *    - Automatic logging integration
 * 
 * ADVANTAGES OF SPRING SERVICES:
 * - Reduced boilerplate code (no manual instantiation)
 * - Automatic transaction management with @Transactional
 * - Automatic dependency injection
 * - Clean separation of concerns
 * - Easy testing with mocks
 * - Consistent error handling
 * - Better maintainability
 * - Loose coupling
 * - Integration with Spring ecosystem
 * ========================================================================
 */

// Service layer for user business logic
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    // Constructor to inject dependencies
    // Without Spring: Would need manual dependency injection or service locator pattern
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    // =========================
    // MAPPERS
    // =========================
    
    // Map User entity to AdminUserDTO
    // Without Spring: Would need manual field copying or manual JSON mapping
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
    // Without Spring: Would need manual field copying
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
    // Without Spring: Would need manual field copying
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
    // Without Spring: Would need manual user lookup from session/token
    public AdminUserDTO getCurrentUser(Authentication auth) {
        User user = findByUsername(auth.getName());
        return mapToAdminDTO(user);
    }

    // Get current authenticated user profile
    // Without Spring: Would need manual profile construction
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
    // Without Spring: Would need manual update logic and error handling
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
    // Without Spring: Would need manual database query and result mapping
    public List<AdminUserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToAdminDTO)
                .toList();
    }

    // Get user by ID (admin only)
    // Without Spring: Would need manual query and error handling
    public AdminUserDTO getUserById(Long id) {
        User user = findById(id);
        return mapToAdminDTO(user);
    }

    // Get user statistics by ID (admin only)
    // Without Spring: Would need manual stats calculation
    public UserStatsDTO getUserStats(Long id) {
        User user = findById(id);
        return mapToStatsDTO(user);
    }

    // Update user by ID (admin only)
    // Without Spring: Would need manual update logic and audit logging
    public AdminUserDTO adminUpdateUser(Long id, UpdateUserDTO dto, String adminUsername) {
        User user = findById(id);
        applyUpdates(user, dto);
        User saved = userRepository.save(user);
        auditLogService.logAction(adminUsername, "USER_UPDATED", user.getUsername(), "Admin updated user profile");
        return mapToAdminDTO(saved);
    }

    // Delete user by ID (admin only)
    // Without Spring: Would need manual delete logic and audit logging
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
    // Without Spring: Would need manual ban logic and audit logging
    public AdminUserDTO banUser(Long id, String adminUsername) {
        User user = findById(id);
        user.setBanned(true);
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "BAN_USER", user.getUsername(), "Admin banned user");
        return mapToAdminDTO(user);
    }

    // Unban user by ID (admin only)
    // Without Spring: Would need manual unban logic and audit logging
    public AdminUserDTO unbanUser(Long id, String adminUsername) {
        User user = findById(id);
        user.setBanned(false);
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "UNBAN_USER", user.getUsername(), "Admin unbanned user");
        return mapToAdminDTO(user);
    }

    // Reset user password by ID (admin only)
    // Without Spring: Would need manual password encoding and update logic
    public AdminUserDTO resetPassword(Long id, String newPassword, String adminUsername) {
        User user = findById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        auditLogService.logAction(adminUsername, "RESET_PASSWORD", user.getUsername(), "Admin reset user password");
        return mapToAdminDTO(user);
    }

    // Get top players by score
    // Without Spring: Would need manual query with ORDER BY and LIMIT
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
    // Without Spring: Would need manual query and exception handling
    private User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Find user by ID or throw exception
    // Without Spring: Would need manual query and exception handling
    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Apply updates from DTO to user entity
    // Without Spring: Would need manual field-by-field update logic
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
