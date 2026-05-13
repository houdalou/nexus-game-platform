package com.example.game_platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 *    - Would need to manually create comments table
 *    - Example: CREATE TABLE comments (id BIGINT PRIMARY KEY, user_id BIGINT, game_id BIGINT, content TEXT, created_at TIMESTAMP)
 *    - Manual foreign key constraints
 *    - Manual text column definition
 * 
 * 2. Manual Text Handling:
 *    - Would need to handle text content manually
 *    - Example: rs.getString("content")
 *    - Manual escaping for SQL injection prevention
 *    - Manual validation for content length
 * 
 * 3. Manual Relationship Queries:
 *    - Would need to write JOIN queries to get comments with user/game info
 *    - Example: SELECT c.*, u.username, g.title FROM comments c JOIN users u ON c.user_id = u.id JOIN games g ON c.game_id = g.id WHERE c.game_id = ?
 *    - Manual mapping of joined results to objects
 *    - Risk of N+1 query problem
 * 
 * 4. Manual Sorting and Pagination:
 *    - Would need to manually add ORDER BY and LIMIT
 *    - Example: SELECT * FROM comments WHERE game_id = ? ORDER BY created_at DESC LIMIT 10
 *    - Manual offset calculation for pagination
 * 
 * WITH JPA:
 * 
 * 1. Automatic Table Creation:
 *    - @Entity annotation automatically creates comments table
 *    - Automatic foreign key constraints with @ManyToOne
 *    - @Lob for large text content
 *    - No manual DDL needed
 * 
 * 2. Automatic Text Handling:
 *    - JPA automatically handles text content
 *    - @Column(length = 1000) for length constraints
 *    - Automatic SQL injection prevention
 *    - No manual escaping needed
 * 
 * 3. Automatic Relationship Loading:
 *    - JPA automatically loads related entities
 *    - FetchType.LAZY for lazy loading
 *    - JOIN FETCH for eager loading
 *    - No manual JOIN queries needed
 * 
 * 4. Automatic Sorting and Pagination:
 *    - Spring Data JPA supports sorting with Sort parameter
 *    - Example: findByGameOrderByCreatedAtDesc(Game game)
 *    - Automatic pagination with Pageable
 *    - No manual LIMIT/OFFSET needed
 * 
 * ADVANTAGES OF JPA RELATIONSHIPS:
 * - Automatic table and constraint creation
 * - Automatic text content handling
 * - Automatic relationship loading
 * - Automatic sorting and pagination support
 * - Type-safe queries
 * - No manual SQL for relationships
 * - Automatic transaction management
 * - Reduced development time
 * - Less error-prone
 * ========================================================================
 */

// Entity representing a user's comment on a game
// Without JPA: Would need manual table creation and SQL queries for comments
@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Comment {

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

    @Lob
    @Column(nullable = false, length = 1000)
    // Without JPA: Would need manual text handling and SQL escaping
    private String content;

    @Column(name = "created_at")
    // Without JPA: Would need manual timestamp management
    private LocalDateTime createdAt;

    @PrePersist
    // Without JPA: Would need manual timestamp setting before insert
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
