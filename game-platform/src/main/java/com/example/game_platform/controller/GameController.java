package com.example.game_platform.controller;

import com.example.game_platform.dto.GameDTO;
import com.example.game_platform.service.GameService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameService service;

    public GameController(GameService service) {
        this.service = service;
    }

    // 🎮 PUBLIC - GET ALL ENABLED GAMES
    @GetMapping
    public List<GameDTO> getAll() {
        return service.getEnabledGames();
    }

    // 🎮 ADMIN - GET ALL GAMES (including disabled)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<GameDTO> getAllForAdmin() {
        return service.getAllGames();
    }

    // ➕ ADMIN ONLY - ADD GAME
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO add(@RequestBody GameDTO dto, Authentication auth) {
        return service.create(dto, auth.getName());
    }

    // ✏️ ADMIN ONLY - UPDATE GAME
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO update(@PathVariable Long id, @RequestBody GameDTO dto, Authentication auth) {
        return service.update(id, dto, auth.getName());
    }

    // ❌ ADMIN ONLY - DELETE GAME
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, auth.getName());
    }

    // 🔘 ADMIN ONLY - TOGGLE ENABLED
    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO toggle(@PathVariable Long id, Authentication auth) {
        return service.toggleEnabled(id, auth.getName());
    }
}