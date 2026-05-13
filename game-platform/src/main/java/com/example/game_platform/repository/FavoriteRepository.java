package com.example.game_platform.repository;

import com.example.game_platform.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUser_IdAndGame_Id(Long userId, Long gameId);

    boolean existsByUser_IdAndGame_Id(Long userId, Long gameId);

    List<Favorite> findByUser_Id(Long userId);

    List<Favorite> findByGame_Id(Long gameId);

    void deleteByUser_IdAndGame_Id(Long userId, Long gameId);
}