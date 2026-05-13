package com.example.game_platform.repository;

import com.example.game_platform.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/* ========================================================================
 * SPRING DATA JPA VS TRADITIONAL JDBC APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING DATA JPA (Traditional JDBC Manual Approach):
 * 
 * 1. Manual SQL Queries:
 *    - Would need to write raw SQL for each query
 *    - Example: String sql = "SELECT * FROM comments WHERE game_id = ? ORDER BY created_at DESC";
 *    - Manual PreparedStatement creation and parameter binding
 *    - Manual ResultSet handling and object mapping
 * 
 * 2. Manual Sorting:
 *    - Would need to manually add ORDER BY clause
 *    - Example: ORDER BY created_at DESC
 *    - Manual string concatenation for dynamic sorting
 * 
 * 3. Manual Pagination:
 *    - Would need to manually add LIMIT and OFFSET
 *    - Example: LIMIT 10 OFFSET 0
 *    - Manual offset calculation for pagination
 * 
 * 4. Manual Text Content Handling:
 *    - Would need to handle large text content (CLOB/TEXT)
 *    - Example: rs.getClob("content") or rs.getString("content")
 *    - Manual escaping for SQL injection prevention
 * 
 * WITH SPRING DATA JPA:
 * 
 * 1. Automatic Query Generation:
 *    - Spring Data JPA generates SQL from method names
 *    - Example: findByGameOrderByCreatedAtDesc() generates "SELECT ... WHERE game_id = ? ORDER BY created_at DESC"
 *    - No manual SQL writing needed
 *    - Automatic parameter binding
 * 
 * 2. Automatic Sorting:
 *    - Method name includes sorting (OrderByCreatedAtDesc)
 *    - Can also use Sort parameter for dynamic sorting
 *    - No manual ORDER BY clause needed
 * 
 * 3. Automatic Pagination:
 *    - Can return Page<Comment> with Pageable parameter
 *    - Automatic LIMIT and OFFSET calculation
 *    - No manual pagination logic needed
 * 
 * 4. Automatic Text Content Handling:
 *    - JPA automatically handles @Lob fields
 *    - Automatic SQL injection prevention
 *    - No manual escaping needed
 * 
 * ADVANTAGES OF SPRING DATA JPA:
 * - No boilerplate code (no DAO implementation)
 * - Automatic query generation from method names
 * - Automatic sorting support
 * - Automatic pagination support
 * - Automatic relationship loading
 * - Type-safe queries
 * - Automatic transaction management
 * - Reduced development time
 * - Less error-prone (no manual SQL)
 * ========================================================================
 */

// Repository interface for Comment entity
// Without Spring: Would need to create CommentDao class with manual SQL queries
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a game ordered by creation date descending
    // Without Spring: Would need manual SQL: SELECT * FROM comments WHERE game_id = ? ORDER BY created_at DESC
    List<Comment> findByGame_GameIdOrderByCreatedAtDesc(Long gameId);

    // Get all comments for a user
    // Without Spring: Would need manual SQL: SELECT * FROM comments WHERE user_id = ?
    List<Comment> findByUser_UserId(Long userId);

    // Count comments for a game
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM comments WHERE game_id = ?
    long countByGame_GameId(Long gameId);

    // Delete all comments for a game
    // Without Spring: Would need manual SQL: DELETE FROM comments WHERE game_id = ?
    void deleteByGame_GameId(Long gameId);
}
