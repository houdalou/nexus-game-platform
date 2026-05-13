package com.example.game_platform.repository;

import com.example.game_platform.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

// Repository interface for Answer entity
public interface AnswerRepository extends JpaRepository<Answer, Long> {}