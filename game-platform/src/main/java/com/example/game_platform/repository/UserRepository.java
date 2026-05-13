package com.example.game_platform.repository;

import com.example.game_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// Repository interface for User entity
public interface UserRepository extends JpaRepository<User, Long> {

    // Count total number of users
    long count();

    // Count users with total score greater than specified value
    long countByTotalScoreGreaterThan(int score);

    // Get top 10 users ordered by total score descending
    List<User> findTop10ByOrderByTotalScoreDesc();

    // Find user by username
    Optional<User> findByUsername(String username);

    // Find user by email
    Optional<User> findByEmail(String email);
}
