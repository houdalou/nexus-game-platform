package com.example.game_platform.repository;

import com.example.game_platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/* ========================================================================
 * SPRING DATA JPA VS TRADITIONAL JDBC/JPA APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING DATA JPA (Traditional JDBC/JPA Manual Approach):
 * 
 * 1. Manual DAO Pattern:
 *    - Would need to create UserDao class manually
 *    - Example: public class UserDao { private Connection conn; ... }
 *    - Manual implementation of CRUD methods
 *    - Manual SQL query writing for each operation
 * 
 * 2. Manual SQL Queries:
 *    - Would need to write raw SQL for each operation
 *    - Example: String sql = "SELECT * FROM users WHERE username = ?";
 *    - Manual PreparedStatement creation and parameter binding
 *    - Example: PreparedStatement stmt = conn.prepareStatement(sql); stmt.setString(1, username);
 *    - Manual ResultSet handling and row mapping
 *    - Example: ResultSet rs = stmt.executeQuery(); while(rs.next()) { User user = new User(); ... }
 * 
 * 3. Manual Connection Management:
 *    - Would need to manually get and close connections
 *    - Example: Connection conn = dataSource.getConnection();
 *    - Manual try-catch-finally for resource cleanup
 *    - Risk of connection leaks if not handled properly
 * 
 * 4. Manual Transaction Management:
 *    - Would need to manually begin, commit, or rollback transactions
 *    - Example: conn.setAutoCommit(false); conn.commit(); conn.rollback();
 *    - Manual try-catch blocks for transaction handling
 * 
 * 5. Manual Exception Handling:
 *    - Would need to catch SQLException for each operation
 *    - Manual conversion of SQLException to business exceptions
 *    - Risk of inconsistent error handling
 * 
 * 6. Manual Query Methods:
 *    - Would need to write custom SQL for complex queries
 *    - Example: String sql = "SELECT * FROM users ORDER BY total_score DESC LIMIT 10";
 *    - Manual pagination implementation
 *    - Example: String sql = "SELECT * FROM users LIMIT ? OFFSET ?";
 * 
 * WITH SPRING DATA JPA:
 * 
 * 1. Automatic Repository Interface:
 *    - Just extend JpaRepository for automatic CRUD
 *    - No need to write DAO implementation
 *    - Spring Data JPA generates implementation at runtime
 *    - Example: public interface UserRepository extends JpaRepository<User, Long>
 * 
 * 2. Automatic Query Generation:
 *    - Spring Data JPA generates SQL from method names
 *    - Example: findByUsername() generates "SELECT ... WHERE username = ?"
 *    - No manual SQL writing needed
 *    - Automatic parameter binding
 * 
 * 3. Automatic Connection Management:
 *    - Spring Data JPA manages connections automatically
 *    - Automatic connection pooling
 *    - Automatic resource cleanup
 *    - No manual connection handling needed
 * 
 * 4. Automatic Transaction Management:
 *    - @Transactional annotation automatically manages transactions
 *    - Automatic commit on success, rollback on exception
 *    - No manual transaction handling needed
 * 
 * 5. Automatic Exception Handling:
 *    - Spring Data JPA converts SQLExceptions to Spring exceptions
 *    - Consistent exception hierarchy
 *    - Automatic translation of database-specific exceptions
 * 
 * 6. Query Methods and @Query:
 *    - Derived query methods from method names
 *    - Example: findByUsername(String username)
 *    - Custom queries with @Query annotation
 *    - Example: @Query("SELECT u FROM User u WHERE u.totalScore > :score")
 *    - Automatic pagination support
 * 
 * ADVANTAGES OF SPRING DATA JPA:
 * - No boilerplate code (no DAO implementation)
 * - Automatic CRUD operations (save, findById, findAll, delete)
 * - Automatic query generation from method names
 * - Automatic connection and transaction management
 * - Automatic exception translation
 * - Type-safe queries
 * - Pagination support out of the box
 * - Easy testing with repositories
 * - Reduced development time
 * - Less error-prone (no manual SQL)
 * - Database-agnostic (works with any JPA provider)
 * ========================================================================
 */

// Repository interface for User entity
// Without Spring: Would need to create UserDao class with manual SQL queries
public interface UserRepository extends JpaRepository<User, Long> {

    // Count total number of users
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM users
    long count();

    // Count users with total score greater than specified value
    // Without Spring: Would need manual SQL: SELECT COUNT(*) FROM users WHERE total_score > ?
    long countByTotalScoreGreaterThan(int score);

    // Get top 10 users ordered by total score descending
    // Without Spring: Would need manual SQL: SELECT * FROM users ORDER BY total_score DESC LIMIT 10
    List<User> findTop10ByOrderByTotalScoreDesc();

    // Find user by username
    // Without Spring: Would need manual SQL: SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);

    // Find user by email
    // Without Spring: Would need manual SQL: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
