package com.example.game_platform.controller;

import com.example.game_platform.entity.Favorite;
import com.example.game_platform.entity.Game;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.FavoriteRepository;
import com.example.game_platform.repository.GameRepository;
import com.example.game_platform.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/* ========================================================================
 * SPRING MVC VS TRADITIONAL SERVLET APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING MVC (Traditional Servlet Approach):
 * 
 * 1. Manual Servlet Creation:
 *    - Would need to create FavoriteServlet extends HttpServlet
 *    - Manual doGet() and doPost() methods
 *    - Manual URL pattern mapping in web.xml
 * 
 * 2. Manual Request Parameter Extraction:
 *    - Would need to manually extract parameters from HttpServletRequest
 *    - Example: Long gameId = Long.parseLong(request.getParameter("gameId"));
 *    - Manual type conversion and validation
 *    - Manual error handling for invalid parameters
 * 
 * 3. Manual Response Writing:
 *    - Would need to manually write JSON response
 *    - Example: response.getWriter().write(jsonString);
 *    - Manual JSON serialization
 *    - Manual setting of content type and status codes
 * 
 * 4. Manual Authentication Check:
 *    - Would need to manually check session for authentication
 *    - Example: HttpSession session = request.getSession(false); if (session == null) return error;
 *    - Manual user lookup from session
 * 
 * WITH SPRING MVC:
 * 
 * 1. Automatic Controller Mapping:
 *    - @RestController annotation creates REST controller automatically
 *    - @RequestMapping defines base URL for all methods
 *    - Each method maps to a specific HTTP method and path
 * 
 * 2. Automatic Parameter Binding:
 *    - @PathVariable automatically extracts path variables
 *    - Authentication object automatically injected
 *    - Automatic type conversion and validation
 * 
 * 3. Automatic Response Handling:
 *    - Return objects automatically serialized to JSON
 *    - Automatic content-type header set to application/json
 *    - No manual response writing needed
 * 
 * 4. Automatic Authentication:
 *    - Authentication object automatically available
 *    - Spring Security automatically validates JWT token
 *    - No manual session checking needed
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

// REST controller for favorite management endpoints
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    // Constructor to inject dependencies
    // Without Spring: Would need manual dependency injection or singleton pattern
    public FavoriteController(FavoriteRepository favoriteRepository, UserRepository userRepository, GameRepository gameRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    // Add game to favorites
    // Without Spring: Would need manual session check, parameter extraction, and SQL insert
    @PostMapping("/{gameId}")
    public Favorite addFavorite(@PathVariable Long gameId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (favoriteRepository.existsByUser_UserIdAndGame_GameId(user.getId(), game.getId())) {
            throw new RuntimeException("Game already in favorites");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .game(game)
                .build();
        return favoriteRepository.save(favorite);
    }

    // Remove game from favorites
    // Without Spring: Would need manual SQL delete and parameter extraction
    @DeleteMapping("/{gameId}")
    public void removeFavorite(@PathVariable Long gameId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (!favoriteRepository.existsByUser_UserIdAndGame_GameId(user.getId(), game.getId())) {
            throw new RuntimeException("Game not in favorites");
        }

        favoriteRepository.deleteByUser_UserIdAndGame_GameId(user.getId(), game.getId());
    }

    // Get user's favorites
    // Without Spring: Would need manual SQL query with JOIN and result mapping
    @GetMapping
    public List<Favorite> getUserFavorites(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUser_UserId(user.getId());
    }

    // Check if game is in user's favorites
    // Without Spring: Would need manual SQL query and boolean conversion
    @GetMapping("/{gameId}/check")
    public boolean checkFavorite(@PathVariable Long gameId, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return favoriteRepository.existsByUser_UserIdAndGame_GameId(user.getId(), game.getId());
    }
}
