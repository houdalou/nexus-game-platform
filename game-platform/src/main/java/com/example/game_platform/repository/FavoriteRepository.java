package com.example.game_platform.repository;

import com.example.game_platform.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

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
 *    - Example: String sql = "SELECT * FROM favorites WHERE user_id = ? AND game_id = ?";
 *    - Manual PreparedStatement creation and parameter binding
 *    - Manual ResultSet handling and object mapping
 * 
 * 2. Manual Relationship Queries:
 *    - Would need to write JOIN queries for related data
 *    - Example: SELECT f.*, g.* FROM favorites f JOIN games g ON f.game_id = g.id WHERE f.user_id = ?
 *    - Manual mapping of joined results to objects
 *    - Risk of N+1 query problem if not careful
 * 
 * 3. Manual Duplicate Checking:
 *    - Would need to manually check if favorite exists
 *    - Example: SELECT COUNT(*) FROM favorites WHERE user_id = ? AND game_id = ?
 *    - Manual boolean conversion
 * 
 * 4. Manual Deletion:
 *    - Would need to write DELETE SQL for removal
 *    - Example: DELETE FROM favorites WHERE user_id = ? AND game_id = ?
 *    - Manual transaction management
 * 
 * WITH SPRING DATA JPA:
 * 
 * 1. Automatic Query Generation:
 *    - Spring Data JPA generates SQL from method names
 *    - Example: findByUserAndGame() generates "SELECT ... WHERE user_id = ? AND game_id = ?"
 *    - No manual SQL writing needed
 *    - Automatic parameter binding
 * 
 * 2. Automatic Relationship Loading:
 *    - JPA automatically loads related entities
 *    - FetchType.LAZY for lazy loading
 *    - FetchType.EAGER for immediate loading
 *    - No manual JOIN queries needed
 * 
 * 3. Automatic Existence Checking:
 *    - existsByUserAndGame() automatically checks existence
 *    - Returns boolean directly
 *    - No manual count query needed
 * 
 * 4. Automatic Deletion:
 *    - deleteByUserAndGame() automatically generates DELETE
 *    - Automatic transaction management with @Transactional
 *    - No manual SQL writing
 * 
 * ADVANTAGES OF SPRING DATA JPA:
 * - No boilerplate code (no DAO implementation)
 * - Automatic query generation from method names
 * - Automatic relationship loading
 * - Type-safe queries
 * - Automatic transaction management
 * - Reduced development time
 * - Less error-prone (no manual SQL)
 * ========================================================================
 */

// Repository interface for Favorite entity
// Without Spring: Would need to create FavoriteDao class with manual SQL queries
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Find favorite by user and game
    // Without Spring: Would need manual SQL: SELECT * FROM favorites WHERE user_id = ? AND game_id = ?
    Optional<Favorite> findByUserAndGame(Long userId, Long gameId);

    // Check if favorite exists
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM favorites WHERE user_id = ? AND game_id = ?
    boolean existsByUserAndGame(Long userId, Long gameId);

    // Get all favorites for a user
    // Without Spring: Would need manual SQL: SELECT * FROM favorites WHERE user_id = ?
    List<Favorite> findByUserId(Long userId);

    // Get all favorites for a game
    // Without Spring: Would need manual SQL: SELECT * FROM favorites WHERE game_id = ?
    List<Favorite> findByGameId(Long gameId);

    // Delete favorite by user and game
    // Without Spring: Would need manual SQL: DELETE FROM favorites WHERE user_id = ? AND game_id = ?
    void deleteByUserAndGame(Long userId, Long gameId);
}
