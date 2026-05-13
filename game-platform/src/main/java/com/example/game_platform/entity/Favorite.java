package com.example.game_platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/* ========================================================================
 * JPA RELATIONSHIPS VS TRADITIONAL JDBC APPROACH
 * ========================================================================
 * 
 * WITHOUT JPA (Traditional JDBC Manual Approach):
 * 
 * 1. Manual Join Table Creation:
 *    - Would need to manually create join table for many-to-many relationships
 *    - Example: CREATE TABLE user_favorites (user_id BIGINT, game_id BIGINT, PRIMARY KEY (user_id, game_id))
 *    - Manual foreign key constraints
 *    - Manual index creation
 * 
 * 2. Manual Relationship Queries:
 *    - Would need to write SQL joins to get user's favorites
 *    - Example: SELECT g.* FROM games g JOIN user_favorites uf ON g.id = uf.game_id WHERE uf.user_id = ?
 *    - Manual ResultSet handling with multiple tables
 *    - Manual object construction from joined results
 * 
 * 3. Manual Relationship Management:
 *    - Would need to manually insert/delete join table rows
 *    - Example: INSERT INTO user_favorites (user_id, game_id) VALUES (?, ?)
 *    - Manual check for duplicates
 *    - Manual cascade delete logic
 * 
 * 4. Manual Bidirectional Navigation:
 *    - Would need to manually query both directions
 *    - No automatic lazy loading
 *    - Manual N+1 query problem handling
 * 
 * WITH JPA:
 * 
 * 1. Automatic Join Table Creation:
 *    - @ManyToMany annotation automatically creates join table
 *    - Automatic foreign key constraints
 *    - Automatic index creation
 *    - No manual DDL needed
 * 
 * 2. Automatic Relationship Queries:
 *    - JPA automatically generates JOIN queries
 *    - Automatic object graph navigation
 *    - Example: user.getFavorites() automatically loads games
 *    - No manual SQL writing
 * 
 * 3. Automatic Relationship Management:
 *    - JPA automatically manages join table rows
 *    - Automatic duplicate prevention
 *    - Automatic cascade operations with CascadeType
 *    - No manual insert/delete needed
 * 
 * 4. Automatic Bidirectional Navigation:
 *    - mappedBy attribute for bidirectional relationships
 *    - Automatic lazy loading with fetch = FetchType.LAZY
 *    - Automatic N+1 query prevention with @EntityGraph
 * 
 * ADVANTAGES OF JPA RELATIONSHIPS:
 * - Automatic join table management
 * - Automatic relationship queries
 * - No manual SQL for relationships
 * - Automatic cascade operations
 * - Type-safe navigation
 * - Lazy loading support
 * - Bidirectional relationship support
 * - Reduced boilerplate code
 * - Less error-prone
 * ========================================================================
 */

// Entity representing a user's favorite game
// Without JPA: Would need manual join table and SQL queries for user-game relationships
@Entity
@Table(name = "favorites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    // Without JPA: Would need manual foreign key and user lookup
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    // Without JPA: Would need manual foreign key and game lookup
    private Game game;

    @Column(name = "created_at")
    // Without JPA: Would need manual timestamp management
    private LocalDateTime createdAt;

    @PrePersist
    // Without JPA: Would need manual timestamp setting before insert
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
