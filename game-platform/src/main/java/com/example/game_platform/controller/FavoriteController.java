package com.example.game_platform.controller;

import com.example.game_platform.entity.*;
import com.example.game_platform.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public FavoriteController(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            GameRepository gameRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    @PostMapping("/{gameId}")
    public Favorite addFavorite(@PathVariable Long gameId, Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (favoriteRepository.existsByUser_IdAndGame_Id(user.getId(), gameId)) {
            throw new RuntimeException("Already in favorites");
        }

        return favoriteRepository.save(
                Favorite.builder()
                        .user(user)
                        .game(game)
                        .build()
        );
    }

    @DeleteMapping("/{gameId}")
    public void removeFavorite(@PathVariable Long gameId, Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!favoriteRepository.existsByUser_IdAndGame_Id(user.getId(), gameId)) {
            throw new RuntimeException("Not in favorites");
        }

        favoriteRepository.deleteByUser_IdAndGame_Id(user.getId(), gameId);
    }

    @GetMapping
    public List<Favorite> getFavorites(Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return favoriteRepository.findByUser_Id(user.getId());
    }

    @GetMapping("/{gameId}/check")
    public boolean checkFavorite(@PathVariable Long gameId, Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return favoriteRepository.existsByUser_IdAndGame_Id(user.getId(), gameId);
    }
}