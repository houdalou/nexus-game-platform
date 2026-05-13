package com.example.game_platform.repository;

import com.example.game_platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repository interface for Question entity
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Find questions by category
    List<Question> findByCategory(String category);
    
    // Find questions by difficulty level
    List<Question> findByDifficulty(String difficulty);
}