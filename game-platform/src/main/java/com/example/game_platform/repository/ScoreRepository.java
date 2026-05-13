package com.example.game_platform.repository;

import com.example.game_platform.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for Score entity
public interface ScoreRepository extends JpaRepository<Score, Long> {
}