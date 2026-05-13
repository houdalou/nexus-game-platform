package com.example.game_platform.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/* ========================================================================
 * JPA RELATIONSHIPS VS TRADITIONAL JDBC APPROACH
 * ========================================================================
 * 
 * WITHOUT JPA (Traditional JDBC Manual Approach):
 * 
 * 1. Manual Relationship Management:
 *    - Would need to manually handle foreign keys in separate tables
 *    - Example: favorites table with user_id and game_id foreign keys
 *    - ratings table with user_id and game_id foreign keys
 *    - comments table with user_id and game_id foreign keys
 * 
 * 2. Manual Bidirectional Navigation:
 *    - Would need to manually query both directions
 *    - Example: SELECT * FROM favorites WHERE game_id = ? to get users who favorited
 *    - Example: SELECT * FROM favorites WHERE user_id = ? to get user's favorites
 *    - No automatic lazy loading
 * 
 * 3. Manual Cascade Operations:
 *    - Would need to manually delete related records when game is deleted
 *    - Example: DELETE FROM favorites WHERE game_id = ?
 *    - Example: DELETE FROM ratings WHERE game_id = ?
 *    - Example: DELETE FROM comments WHERE game_id = ?
 *    - Manual transaction management
 * 
 * 4. Manual Collection Management:
 *    - Would need to manually load collections
 *    - Example: List<Favorite> favorites = favoriteDao.findByGameId(gameId)
 *    - No automatic collection initialization
 * 
 * WITH JPA:
 * 
 * 1. Automatic Relationship Management:
 *    - @OneToMany annotation automatically manages relationships
 *    - Automatic foreign key creation in child tables
 *    - mappedBy attribute for bidirectional relationships
 *    - No manual foreign key handling needed
 * 
 * 2. Automatic Bidirectional Navigation:
 *    - JPA automatically loads both directions
 *    - game.getFavorites() loads users who favorited
 *    - user.getFavorites() loads user's favorite games
 *    - FetchType.LAZY for lazy loading
 * 
 * 3. Automatic Cascade Operations:
 *    - CascadeType.ALL automatically cascades delete
 *    - When game is deleted, all favorites, ratings, comments are deleted
 *    - No manual delete queries needed
 *    - Automatic transaction management
 * 
 * 4. Automatic Collection Management:
 *    - JPA automatically manages collections
 *    - Automatic lazy loading with fetch = FetchType.LAZY
 *    - No manual collection loading needed
 * 
 * ADVANTAGES OF JPA RELATIONSHIPS:
 * - Automatic relationship management
 * - Automatic bidirectional navigation
 * - Automatic cascade operations
 * - Automatic collection management
 * - Lazy loading support
 * - Type-safe navigation
 * - No manual SQL for relationships
 * - Reduced boilerplate code
 * - Less error-prone
 * ========================================================================
 */

// Entity representing a game in the platform
// Without JPA: Would need manual relationship management with foreign keys and join queries
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer xpReward;
    private String imageUrl;
    private String slug;

    @Builder.Default
    private Boolean enabled = true;

    // One-to-many relationship with favorites (users who favorited this game)
    // Without JPA: Would need manual query: SELECT * FROM favorites WHERE game_id = ?
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    // Without JPA: Would need manual cascade delete logic when game is deleted
    private List<Favorite> favorites;

    // One-to-many relationship with ratings (ratings for this game)
    // Without JPA: Would need manual query: SELECT * FROM ratings WHERE game_id = ?
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    // Without JPA: Would need manual cascade delete logic when game is deleted
    private List<Rating> ratings;

    // One-to-many relationship with comments (comments on this game)
    // Without JPA: Would need manual query: SELECT * FROM comments WHERE game_id = ?
    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    // Without JPA: Would need manual cascade delete logic when game is deleted
    private List<Comment> comments;
}