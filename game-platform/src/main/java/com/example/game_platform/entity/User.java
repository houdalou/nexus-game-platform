package com.example.game_platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/* ========================================================================
 * JPA VS TRADITIONAL JDBC APPROACH
 * ========================================================================
 * 
 * WITHOUT JPA (Traditional JDBC Manual Approach):
 * 
 * 1. Manual POJO Creation:
 *    - Would need to create plain Java class with fields
 *    - Example: public class User { private Long id; private String username; ... }
 *    - Manual getter and setter methods
 *    - No automatic relationship mapping
 * 
 * 2. Manual SQL Mapping:
 *    - Would need to manually map database columns to object fields
 *    - Example: user.setId(rs.getLong("id")); user.setUsername(rs.getString("username"));
 *    - Manual type conversion for each field
 *    - Risk of type mismatch errors
 * 
 * 3. Manual Table Creation:
 *    - Would need to write SQL DDL statements manually
 *    - Example: CREATE TABLE users (id BIGINT PRIMARY KEY, username VARCHAR(255), ...);
 *    - Manual foreign key constraints
 *    - Manual index creation
 * 
 * 4. Manual Relationship Management:
 *    - Would need to manually handle foreign keys
 *    - Example: SELECT * FROM users WHERE game_id = ?
 *    - Manual join table creation for many-to-many relationships
 *    - Manual cascade delete/update logic
 * 
 * 5. Manual CRUD Operations:
 *    - Would need to write INSERT, UPDATE, DELETE SQL for each entity
 *    - Example: String sql = "INSERT INTO users (username, password) VALUES (?, ?)";
 *    - Manual PreparedStatement for each operation
 *    - Manual parameter binding
 * 
 * WITH JPA:
 * 
 * 1. Automatic Entity Mapping:
 *    - @Entity annotation marks class as JPA entity
 *    - Automatic table generation from class name
 *    - @Table annotation for custom table name
 *    - Lombok annotations (@Getter, @Setter) for automatic getters/setters
 * 
 * 2. Automatic Field Mapping:
 *    - @Column annotation maps fields to database columns
 *    - Automatic type conversion between Java and SQL types
 *    - @Id annotation marks primary key
 *    - @GeneratedValue for auto-increment
 * 
 * 3. Automatic Schema Generation:
 *    - JPA automatically creates tables based on entity annotations
 *    - Automatic foreign key constraints
 *    - Automatic index creation
 *    - Configurable via spring.jpa.hibernate.ddl-auto
 * 
 * 4. Automatic Relationship Management:
 *    - @OneToMany, @ManyToOne, @ManyToMany for relationships
 *    - Automatic foreign key management
 *    - Automatic join table creation for many-to-many
 *    - Cascade operations with CascadeType
 * 
 * 5. Automatic CRUD Operations:
 *    - JpaRepository provides save, findById, findAll, delete automatically
 *    - No manual SQL writing needed
 *    - Automatic entity state tracking
 * 
 * ADVANTAGES OF JPA:
 * - No boilerplate code (no manual getters/setters with Lombok)
 * - Automatic table and column mapping
 * - Automatic type conversion
 * - Automatic relationship management
 * - Automatic CRUD operations
 * - Database-agnostic (works with any database)
 * - Reduced development time
 * - Less error-prone (no manual SQL)
 * - Easy to maintain and refactor
 * - Clear separation between entity and data access
 * ========================================================================
 */

// Entity representing a user in the system
// Without JPA: Would need manual POJO with getters/setters and SQL mapping
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    // Primary key with auto-generation
    // Without JPA: Would need manual ID assignment and SQL mapping
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Username field with unique constraint
    // Without JPA: Would need manual SQL: username VARCHAR(255) UNIQUE NOT NULL
    @Column(unique = true, nullable = false)
    private String username;

    // Password field (hidden in JSON responses)
    // Without JPA: Would need manual SQL: password VARCHAR(255) NOT NULL
    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    // User role stored as enum string
    // Without JPA: Would need manual SQL: role VARCHAR(50) NOT NULL
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // User email
    // Without JPA: Would need manual SQL: email VARCHAR(255)
    private String email;
    
    // User avatar URL
    // Without JPA: Would need manual SQL: avatar_url VARCHAR(500)
    private String avatarUrl;

    // User statistics fields
    // Without JPA: Would need manual SQL with default values
    private Integer totalScore = 0;
    private Integer xp = 0;
    private Integer level = 1;
    private String badge;

    // Banned status with default false
    // Without JPA: Would need manual SQL: banned BOOLEAN DEFAULT FALSE
    @Builder.Default
    private Boolean banned = false;

    // One-to-many relationship with favorites (games user has favorited)
    // Without JPA: Would need manual query: SELECT * FROM favorites WHERE user_id = ?
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // Without JPA: Would need manual cascade delete logic when user is deleted
    private List<Favorite> favorites;

    // One-to-many relationship with ratings (ratings user has given)
    // Without JPA: Would need manual query: SELECT * FROM ratings WHERE user_id = ?
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // Without JPA: Would need manual cascade delete logic when user is deleted
    private List<Rating> ratings;

    // One-to-many relationship with comments (comments user has posted)
    // Without JPA: Would need manual query: SELECT * FROM comments WHERE user_id = ?
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    // Without JPA: Would need manual cascade delete logic when user is deleted
    private List<Comment> comments;

    // Get rank alias for badge
    public String getRank() {
        return badge;
    }

    // Get user authorities for Spring Security
    // Without Spring: Would need manual role checking and authority collection
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name())
        );
    }

    // Check if account is not expired
    // Without Spring: Would need manual expiration check logic
    @Override
    public boolean isAccountNonExpired() { return true; }

    // Check if account is not locked (based on banned status)
    // Without Spring: Would need manual banned status check
    @Override
    public boolean isAccountNonLocked() { return !Boolean.TRUE.equals(banned); }

    // Check if credentials are not expired
    // Without Spring: Would need manual credential expiration logic
    @Override
    public boolean isCredentialsNonExpired() { return true; }

    // Check if account is enabled (based on banned status)
    // Without Spring: Would need manual enabled status check
    @Override
    public boolean isEnabled() { return !Boolean.TRUE.equals(banned); }

    // Get user password for authentication
    // Without Spring: Would need manual password retrieval from session/database
    @Override
    public String getPassword() {
        return password;
    }

    // Get username for authentication
    // Without Spring: Would need manual username retrieval
    @Override
    public String getUsername() {
        return username;
    }
}