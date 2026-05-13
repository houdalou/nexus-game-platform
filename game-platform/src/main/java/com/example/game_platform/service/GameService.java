package com.example.game_platform.service;

import com.example.game_platform.dto.GameDTO;
import com.example.game_platform.entity.Game;
import com.example.game_platform.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository repo;
    private final AuditLogService auditLogService;

    // Constructor to inject dependencies
    public GameService(GameRepository repo, AuditLogService auditLogService) {
        this.repo = repo;
        this.auditLogService = auditLogService;
    }

    // Map Game entity to GameDTO
    private GameDTO mapToDTO(Game game) {
        return GameDTO.builder()
                .id(game.getId())
                .title(game.getTitle())
                .description(game.getDescription())
                .category(game.getCategory())
                .difficulty(game.getDifficulty())
                .xpReward(game.getXpReward())
                .imageUrl(game.getImageUrl())
                .slug(game.getSlug())
                .enabled(game.getEnabled())
                .build();
    }

    // Get all games (including disabled)
    public List<GameDTO> getAllGames() {
        return repo.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Get only enabled games
    public List<GameDTO> getEnabledGames() {
        return repo.findAll()
                .stream()
                .filter(g -> g.getEnabled() == null || g.getEnabled())
                .map(this::mapToDTO)
                .toList();
    }

    // Get game by ID
    public GameDTO getById(Long id) {
        Game game = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return mapToDTO(game);
    }

    // Create new game (admin only)
    public GameDTO create(GameDTO dto, String adminUsername) {
        Game game = new Game();
        applyFromDTO(game, dto);
        Game saved = repo.save(game);
        auditLogService.logAction(adminUsername, "GAME_CREATED", game.getTitle(), "Admin created game");
        return mapToDTO(saved);
    }

    // Update game by ID (admin only)
    public GameDTO update(Long id, GameDTO dto, String adminUsername) {
        Game existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        applyFromDTO(existing, dto);
        Game saved = repo.save(existing);
        auditLogService.logAction(adminUsername, "GAME_UPDATED", existing.getTitle(), "Admin updated game");
        return mapToDTO(saved);
    }

    // Delete game by ID (admin only)
    public void delete(Long id, String adminUsername) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Game not found");
        }
        Game game = repo.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        String title = game.getTitle();
        repo.deleteById(id);
        auditLogService.logAction(adminUsername, "GAME_DELETED", title, "Admin deleted game");
    }

    // Toggle game enabled/disabled status (admin only)
    public GameDTO toggleEnabled(Long id, String adminUsername) {
        Game game = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        boolean newState = !Boolean.TRUE.equals(game.getEnabled());
        game.setEnabled(newState);
        Game saved = repo.save(game);
        auditLogService.logAction(adminUsername, newState ? "GAME_ENABLED" : "GAME_DISABLED", game.getTitle(), "Admin " + (newState ? "enabled" : "disabled") + " game");
        return mapToDTO(saved);
    }

    // Apply DTO values to game entity
    private void applyFromDTO(Game game, GameDTO dto) {
        game.setTitle(dto.getTitle());
        game.setDescription(dto.getDescription());
        game.setCategory(dto.getCategory());
        game.setDifficulty(dto.getDifficulty());
        game.setXpReward(dto.getXpReward());
        game.setImageUrl(dto.getImageUrl());
        game.setSlug(dto.getSlug());
        if (dto.getEnabled() != null) {
            game.setEnabled(dto.getEnabled());
        }
    }
}