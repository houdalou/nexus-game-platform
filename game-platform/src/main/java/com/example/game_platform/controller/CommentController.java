package com.example.game_platform.controller;

import com.example.game_platform.entity.Comment;
import com.example.game_platform.entity.Game;
import com.example.game_platform.entity.User;
import com.example.game_platform.repository.CommentRepository;
import com.example.game_platform.repository.GameRepository;
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
 *    - Would need to create CommentServlet extends HttpServlet
 *    - Manual doGet() and doPost() methods
 *    - Manual URL pattern mapping in web.xml
 * 
 * 2. Manual Request Parameter Extraction:
 *    - Would need to manually extract JSON from request body
 *    - Example: BufferedReader reader = request.getReader(); StringBuilder sb = new StringBuilder();
 *    - Manual JSON parsing (using Jackson or manual string parsing)
 *    - Manual text content handling and escaping
 * 
 * 3. Manual Response Writing:
 *    - Would need to manually write JSON response
 *    - Example: response.getWriter().write(jsonString);
 *    - Manual JSON serialization
 *    - Manual setting of content type and status codes
 * 
 * 4. Manual Sorting and Pagination:
 *    - Would need to manually add ORDER BY and LIMIT clauses
 *    - Example: SELECT * FROM comments WHERE game_id = ? ORDER BY created_at DESC LIMIT 10
 *    - Manual offset calculation for pagination
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
 * 4. Automatic Sorting:
 *    - Repository method name includes sorting (OrderByCreatedAtDesc)
 *    - Automatic ORDER BY clause generation
 *    - No manual sorting logic needed
 * 
 * ADVANTAGES OF SPRING MVC:
 * - Reduced boilerplate code (no manual Servlet creation)
 * - Automatic parameter binding and type conversion
 * - Automatic JSON serialization/deserialization
 * - Declarative URL routing with annotations
 * - Automatic authentication integration
 * - Automatic sorting support
 * - Clean, readable code
 * - Easy testing and maintenance
 * ========================================================================
 */

// REST controller for comment management endpoints
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    // Constructor to inject dependencies
    // Without Spring: Would need manual dependency injection or singleton pattern
    public CommentController(CommentRepository commentRepository, UserRepository userRepository, GameRepository gameRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    // Add comment to a game
    // Without Spring: Would need manual JSON parsing, SQL insert, and parameter extraction
    @PostMapping("/{gameId}")
    public Comment addComment(@PathVariable Long gameId, @RequestBody Map<String, String> body, Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }
        if (content.length() > 1000) {
            throw new RuntimeException("Comment content cannot exceed 1000 characters");
        }

        Comment comment = Comment.builder()
                .user(user)
                .game(game)
                .content(content.trim())
                .build();
        return commentRepository.save(comment);
    }

    // Get comments for a game (ordered by creation date descending)
    // Without Spring: Would need manual SQL with ORDER BY and result mapping
    @GetMapping("/game/{gameId}")
    public List<Comment> getGameComments(@PathVariable Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        return commentRepository.findByGameOrderByCreatedAtDesc(gameId);
    }

    // Get user's comments
    // Without Spring: Would need manual SQL query with result mapping
    @GetMapping
    public List<Comment> getUserComments(Authentication auth) {
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return commentRepository.findByUserId(user.getId());
    }

    // Delete a comment
    // Without Spring: Would need manual SQL delete and parameter extraction
    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId, Authentication auth) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Only allow user to delete their own comments
        if (!comment.getUser().getUsername().equals(auth.getName())) {
            throw new RuntimeException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    // Get comment count for a game
    // Without Spring: Would need manual SQL count query
    @GetMapping("/game/{gameId}/count")
    public Map<String, Long> getCommentCount(@PathVariable Long gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        long count = commentRepository.countByGameId(gameId);
        return Map.of("count", count);
    }
}
