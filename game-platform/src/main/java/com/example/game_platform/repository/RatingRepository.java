package com.example.game_platform.repository;

import com.example.game_platform.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/* ========================================================================
 * SPRING DATA JPA VS TRADITIONAL JDBC APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING DATA JPA (Traditional JDBC Manual Approach):
 * 
 * 1. Manual SQL Queries:
 *    - Would need to write raw SQL for each query
 *    - Example: String sql = "SELECT AVG(rating) FROM ratings WHERE game_id = ?";
 *    - Manual PreparedStatement creation and parameter binding
 *    - Manual ResultSet handling and type conversion
 * 
 * 2. Manual Aggregate Queries:
 *    - Would need to write aggregate functions manually
 *    - Example: SELECT AVG(rating) FROM ratings WHERE game_id = ?
 *    - Manual handling of NULL results
 *    - Manual type conversion (ResultSet.getDouble)
 * 
 * 3. Manual Duplicate Checking:
 *    - Would need to manually check if rating exists
 *    - Example: SELECT COUNT(*) FROM ratings WHERE user_id = ? AND game_id = ?
 *    - Manual boolean conversion
 * 
 * 4. Manual Relationship Queries:
 *    - Would need to write JOIN queries for related data
 *    - Example: SELECT r.*, g.* FROM ratings r JOIN games g ON r.game_id = g.id WHERE r.user_id = ?
 *    - Manual mapping of joined results to objects
 * 
 * WITH SPRING DATA JPA:
 * 
 * 1. Automatic Query Generation:
 *    - Spring Data JPA generates SQL from method names
 *    - Example: findByUserAndGame() generates "SELECT ... WHERE user_id = ? AND game_id = ?"
 *    - No manual SQL writing needed
 *    - Automatic parameter binding
 * 
 * 2. Automatic Aggregate Queries:
 *    - @Query annotation supports JPQL with aggregate functions
 *    - Example: @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.game.id = :gameId")
 *    - Automatic type conversion
 *    - Automatic null handling
 * 
 * 3. Automatic Existence Checking:
 *    - existsByUserAndGame() automatically checks existence
 *    - Returns boolean directly
 *    - No manual count query needed
 * 
 * 4. Automatic Relationship Loading:
 *    - JPA automatically loads related entities
 *    - FetchType.LAZY for lazy loading
 *    - No manual JOIN queries needed
 * 
 * ADVANTAGES OF SPRING DATA JPA:
 * - No boilerplate code (no DAO implementation)
 * - Automatic query generation from method names
 * - @Query for custom JPQL queries
 * - Automatic relationship loading
 * - Type-safe queries
 * - Automatic transaction management
 * - Reduced development time
 * - Less error-prone (no manual SQL)
 * ========================================================================
 */

// Repository interface for Rating entity
// Without Spring: Would need to create RatingDao class with manual SQL queries
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find rating by user and game
    // Without Spring: Would need manual SQL: SELECT * FROM ratings WHERE user_id = ? AND game_id = ?
    Optional<Rating> findByUserAndGame(Long userId, Long gameId);

    // Check if rating exists
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM ratings WHERE user_id = ? AND game_id = ?
    boolean existsByUserAndGame(Long userId, Long gameId);

    // Get all ratings for a user
    // Without Spring: Would need manual SQL: SELECT * FROM ratings WHERE user_id = ?
    List<Rating> findByUserId(Long userId);

    // Get all ratings for a game
    // Without Spring: Would need manual SQL: SELECT * FROM ratings WHERE game_id = ?
    List<Rating> findByGameId(Long gameId);

    // Calculate average rating for a game
    // Without Spring: Would need manual SQL: SELECT AVG(rating) FROM ratings WHERE game_id = ?
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.game.id = :gameId")
    Double averageRatingByGameId(@Param("gameId") Long gameId);

    // Count ratings for a game
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM ratings WHERE game_id = ?
    long countByGameId(Long gameId);
}
