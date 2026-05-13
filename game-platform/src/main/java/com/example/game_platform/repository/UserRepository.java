package com.example.game_platform.repository;

import com.example.game_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;      // ✅ ADD THIS
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    long count();

    long countByTotalScoreGreaterThan(int score);


    List<User> findTop10ByOrderByTotalScoreDesc();
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
