package com.example.game_platform.service;

import com.example.game_platform.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repo;

    // Constructor to inject UserRepository dependency
    public CustomUserDetailsService(UserRepository repo) {
        this.repo = repo;
    }

    // Load user by username for Spring Security authentication
    @Override
    public UserDetails loadUserByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}