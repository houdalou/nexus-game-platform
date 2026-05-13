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
 * 1. Manual Table Creation:
 *    - Would need to manually create ratings table
 *    - Example: CREATE TABLE ratings (id BIGINT PRIMARY KEY, user_id BIGINT, game_id BIGINT, rating INT, created_at TIMESTAMP)
 *    - Manual foreign key constraints
 *    - Manual unique constraint to prevent duplicate ratings
 * 
 * 2. Manual Average Rating Calculation:
 *    - Would need to write SQL aggregate query
 *    - Example: SELECT AVG(rating) FROM ratings WHERE game_id = ?
 *    - Manual ResultSet handling and type conversion
 *    - Manual null handling for no ratings
 * 
 * 3. Manual Rating Updates:
 *    - Would need to check if rating exists before inserting
 *    - Example: SELECT COUNT(*) FROM ratings WHERE user_id = ? AND game_id = ?
 *    - Manual INSERT or UPDATE based on existence
 *    - Manual transaction management
 * 
 * 4. Manual Rating Count:
 *    - Would need to write count query
 *    - Example: SELECT COUNT(*) FROM ratings WHERE game_id = ?
 *    - Manual integer conversion
 * 
 * WITH JPA:
 * 
 * 1. Automatic Table Creation:
 *    - @Entity annotation automatically creates ratings table
 *    - Automatic foreign key constraints with @ManyToOne
 *    - @UniqueConstraint to prevent duplicate ratings
 *    - No manual DDL needed
 * 
 * 2. Automatic Aggregation Queries:
 *    - Can use @Query with AVG aggregate function
 *    - Example: @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.game.id = :gameId")
 *    - Automatic type conversion
 *    - Automatic null handling
 * 
 * 3. Automatic Upsert Logic:
 *    - JPA handles INSERT or UPDATE based on entity state
 *    - @Transactional ensures atomic operations
 *    - No manual existence checking needed
 * 
 * 4. Automatic Count Queries:
 *    - countByGame() automatically generates COUNT query
 *    - Example: countByGame(Game game)
 *    - Returns long directly
 *    - No manual SQL writing
 * 
 * ADVANTAGES OF JPA RELATIONSHIPS:
 * - Automatic table and constraint creation
 * - Automatic aggregate query support with @Query
 * - Automatic entity state management
 * - Type-safe queries
 * - No manual SQL for relationships
 * - Automatic transaction management
 * - Reduced development time
 * - Less error-prone
 * ========================================================================
 */

// Entity representing a user's rating for a game
// Without JPA: Would need manual table creation and SQL queries for ratings
@Entity
@Table(name = "ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "game_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {

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

    @Column(nullable = false)
    // Without JPA: Would need manual validation for rating range (1-5)
    private Integer rating;

    @Column(name = "created_at")
    // Without JPA: Would need manual timestamp management
    private LocalDateTime createdAt;

    @PrePersist
    // Without JPA: Would need manual timestamp setting before insert
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
