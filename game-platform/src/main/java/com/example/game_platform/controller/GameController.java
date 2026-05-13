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

    // Constructor to inject GameService dependency
    public GameController(GameService service) {
        this.service = service;
    }

    // Get all enabled games (public endpoint)
    @GetMapping
    public List<GameDTO> getAll() {
        return service.getEnabledGames();
    }

    // Get all games including disabled ones (admin only)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public List<GameDTO> getAllForAdmin() {
        return service.getAllGames();
    }

    // Add new game (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO add(@RequestBody GameDTO dto, Authentication auth) {
        return service.create(dto, auth.getName());
    }

    // Update game by ID (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO update(@PathVariable Long id, @RequestBody GameDTO dto, Authentication auth) {
        return service.update(id, dto, auth.getName());
    }

    // Delete game by ID (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id, Authentication auth) {
        service.delete(id, auth.getName());
    }

    // Toggle game enabled/disabled status (admin only)
    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public GameDTO toggle(@PathVariable Long id, Authentication auth) {
        return service.toggleEnabled(id, auth.getName());
    }
}