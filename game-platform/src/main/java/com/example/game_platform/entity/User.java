package com.example.game_platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String email;
    private String avatarUrl;

    private Integer totalScore = 0;
    private Integer xp = 0;
    private Integer level = 1;
    private String badge;

    @Builder.Default
    private Boolean banned = false;

    // Get rank alias for badge
    public String getRank() {
        return badge;
    }

    // Get user authorities for Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    // Check if account is not expired
    @Override
    public boolean isAccountNonExpired() { return true; }

    // Check if account is not locked (based on banned status)
    @Override
    public boolean isAccountNonLocked() { return !Boolean.TRUE.equals(banned); }

    // Check if credentials are not expired
    @Override
    public boolean isCredentialsNonExpired() { return true; }

    // Check if account is enabled (based on banned status)
    @Override
    public boolean isEnabled() { return !Boolean.TRUE.equals(banned); }

    // Get user password for authentication
    @Override
    public String getPassword() {
        return password;
    }

    // Get username for authentication
    @Override
    public String getUsername() {
        return username;
    }
}