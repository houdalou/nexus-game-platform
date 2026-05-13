package com.example.game_platform.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey123456";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract username safely
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Extract role
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // MAIN FIX HERE (safe validation)
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);

            if (username == null || userDetails == null) return false;

            return username.trim().equalsIgnoreCase(userDetails.getUsername().trim())
                    && !isTokenExpired(token);

        } catch (Exception e) {
            return false;
        }
    }

    // Check expiration
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // Centralized parsing (IMPORTANT FIX)
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}