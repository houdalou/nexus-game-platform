package com.example.game_platform.repository;

import com.example.game_platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByCategory(String category);
    List<Question> findByDifficulty(String difficulty);
}