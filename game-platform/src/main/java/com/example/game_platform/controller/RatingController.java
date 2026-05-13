package com.example.game_platform.controller;

import com.example.game_platform.entity.Game;
import com.example.game_platform.entity.Rating;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.GameRepository;
import com.example.game_platform.repository.RatingRepository;
import com.example.game_platform.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/* ========================================================================
 * SPRING MVC VS TRADITIONAL SERVLET APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING MVC (Traditional Servlet Approach):
 * 
 * 1. Manual Servlet Creation:
 *    - Would need to create RatingServlet extends HttpServlet
 *    - Manual doGet() and doPost() methods
 *    - Manual URL pattern mapping in web.xml
 * 
 * 2. Manual Request Parameter Extraction:
 *    - Would need to manually extract parameters from HttpServletRequest
 *    - Example: int rating = Integer.parseInt(request.getParameter("rating"));
 *    - Manual type conversion and validation
 *    - Manual error handling for invalid rating values
 * 
 * 3. Manual Response Writing:
 *    - Would need to manually write JSON response
 *    - Example: response.getWriter().write(jsonString);
 *    - Manual JSON serialization
 *    - Manual setting of content type and status codes
 * 
 * 4. Manual Aggregate Queries:
 *    - Would need to write SQL aggregate function manually
 *    - Example: SELECT AVG(rating) FROM ratings WHERE game_id = ?
 *    - Manual ResultSet handling and type conversion
 * 
 * WITH SPRING MVC:
 * 
 * 1. Automatic Controller Mapping:
 *    - @RestController annotation creates REST controller automatically
 *    - @RequestMapping defines base URL for all methods
 *    - Each method maps to a specific HTTP method and path
 * 
 * 2. Automatic Parameter Binding:
 *    - @RequestBody automatically parses JSON to objects
 *    - @PathVariable automatically extracts path variables
 *    - Authentication object automatically injected
 *    - Automatic type conversion and validation
 * 
 * 3. Automatic Response Handling:
 *    - Return objects automatically serialized to JSON
 *    - Automatic content-type header set to application/json
 *    - No manual response writing needed
 * 
 * 4. Automatic Aggregate Queries:
 *    - Repository method automatically generates aggregate query
 *    - Example: averageRatingByGameId() generates SELECT AVG(rating)
 *    - Automatic type conversion
 * 
 * ADVANTAGES OF SPRING MVC:
 * - Reduced boilerplate code (no manual Servlet creation)
 * - Automatic parameter binding and type conversion
 * - Automatic JSON serialization/deserialization
 * - Declarative URL routing with annotations
 * - Automatic authentication integration
 * - Clean, readable code
 * - Easy testing and maintenance
 * ========================================================================
 */

// REST controller for rating management endpoints
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    // Constructor to inject dependencies
    // Without Spring: Would need manual dependency injection or singleton pattern
    public RatingController(RatingRepository ratingRepository, UserRepository userRepository, GameRepository gameRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    // Rate a game (create or update rating)
    // Without Spring: Would need manual SQL upsert logic and parameter extraction
    @PostMapping("/{gameId}")
    public Rating rateGame(@PathVariable Long gameId, @RequestBody Map<String, Integer> body, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Integer ratingValue = body.get("rating");
        if (ratingValue == null || ratingValue < 1 || ratingValue > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Check if rating already exists and update it
        if (ratingRepository.existsByUserAndGame(user.getId(), game.getId())) {
            Rating existing = ratingRepository.findByUserAndGame(user.getId(), game.getId())
                    .orElseThrow(() -> new RuntimeException("Rating not found"));
            existing.setRating(ratingValue);
            return ratingRepository.save(existing);
        }

        // Create new rating
        Rating rating = Rating.builder()
                .user(user)
                .game(game)
                .rating(ratingValue)
                .build();
        return ratingRepository.save(rating);
    }

    // Get user's ratings
    // Without Spring: Would need manual SQL query with JOIN and result mapping
    @GetMapping
    public List<Rating> getUserRatings(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ratingRepository.findByUserId(user.getId());
    }

    // Get ratings for a specific game
    // Without Spring: Would need manual SQL query with result mapping
    @GetMapping("/game/{gameId}")
    public List<Rating> getGameRatings(@PathVariable Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return ratingRepository.findByGameId(gameId);
    }

    // Get average rating for a game
    // Without Spring: Would need manual SQL aggregate query: SELECT AVG(rating) FROM ratings WHERE game_id = ?
    @GetMapping("/game/{gameId}/average")
    public Map<String, Object> getAverageRating(@PathVariable Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        Double average = ratingRepository.averageRatingByGameId(gameId);
        long count = ratingRepository.countByGameId(gameId);
        
        return Map.of(
                "averageRating", average != null ? average : 0.0,
                "ratingCount", count
        );
    }

    // Get user's rating for a specific game
    // Without Spring: Would need manual SQL query and result mapping
    @GetMapping("/game/{gameId}/user")
    public Rating getUserRatingForGame(@PathVariable Long gameId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        return ratingRepository.findByUserAndGame(user.getId(), game.getId())
                .orElse(null);
    }
}
