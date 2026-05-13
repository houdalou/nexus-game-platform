package com.example.game_platform.controller;

import com.example.game_platform.dto.AdminUserDTO;
import com.example.game_platform.dto.UpdateUserDTO;
import com.example.game_platform.dto.UserProfileDTO;
import com.example.game_platform.dto.UserStatsDTO;
import com.example.game_platform.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
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
 *    - Would need to create a separate Servlet class for each endpoint
 *    - Example: UserServlet extends HttpServlet
 *    - Each Servlet would handle doGet() and doPost() methods
 *    - Manual URL pattern mapping in web.xml
 * 
 * 2. Manual Request Parameter Extraction:
 *    - Would need to manually extract parameters from HttpServletRequest
 *    - Example: String id = request.getParameter("id");
 *    - Manual type conversion and validation
 *    - Manual parsing of JSON request bodies
 * 
 * 3. Manual Response Writing:
 *    - Would need to manually write response to HttpServletResponse
 *    - Example: response.getWriter().write(jsonString);
 *    - Manual JSON serialization (Jackson or manual string building)
 *    - Manual setting of content type and status codes
 * 
 * 4. Manual URL Routing:
 *    - Would need to map URLs to Servlets in web.xml
 *    - Example: <servlet-mapping><url-pattern>/api/users</url-pattern></servlet-mapping>
 *    - Manual path variable extraction from URL
 *    - Example: String path = request.getPathInfo(); String[] parts = path.split("/");
 * 
 * 5. Manual Dependency Injection:
 *    - Would need to manually instantiate or use singleton pattern
 *    - Example: UserService userService = UserService.getInstance();
 *    - Manual service lookup or factory pattern
 *    - Tight coupling between components
 * 
 * 6. Manual Security Checks:
 *    - Would need to manually check authentication in each Servlet
 *    - Example: HttpSession session = request.getSession(false); if (session == null) return error;
 *    - Manual role checking in each protected method
 *    - Example: if (!session.getAttribute("role").equals("ADMIN")) return error;
 * 
 * WITH SPRING MVC:
 * 
 * 1. Automatic Controller Mapping:
 *    - @RestController annotation creates REST controller automatically
 *    - @RequestMapping defines base URL for all methods
 *    - Each method maps to a specific HTTP method and path
 *    - No need for web.xml configuration
 * 
 * 2. Automatic Parameter Binding:
 *    - @RequestParam automatically extracts query parameters
 *    - @PathVariable automatically extracts path variables
 *    - @RequestBody automatically parses JSON to objects
 *    - Authentication object automatically injected
 *    - Automatic type conversion and validation
 * 
 * 3. Automatic Response Handling:
 *    - Return objects automatically serialized to JSON
 *    - Automatic content-type header set to application/json
 *    - Automatic status code handling (200 for success)
 *    - No manual response writing needed
 * 
 * 4. Declarative URL Routing:
 *    - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping for HTTP methods
 *    - Path variables extracted automatically with @PathVariable
 *    - Clean, readable URL mapping in code
 * 
 * 5. Automatic Dependency Injection:
 *    - Constructor injection with @Autowired (implicit)
 *    - Spring automatically provides dependencies
 *    - Loose coupling between components
 *    - Easy testing with mock dependencies
 * 
 * 6. Declarative Security:
 *    - @PreAuthorize annotations for method-level security
 *    - Automatic role checking before method execution
 *    - Authentication object automatically available
 *    - No manual security checks in each method
 * 
 * ADVANTAGES OF SPRING MVC:
 * - Reduced boilerplate code (no manual Servlet creation)
 * - Automatic parameter binding and type conversion
 * - Automatic JSON serialization/deserialization
 * - Declarative URL routing with annotations
 * - Automatic dependency injection
 * - Declarative security with @PreAuthorize
 * - Clean, readable code
 * - Easy testing and maintenance
 * - RESTful API support out of the box
 * - Integration with Spring ecosystem
 * ========================================================================
 */

// REST controller for user management endpoints
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Constructor to inject UserService dependency
    // Without Spring: Would need manual dependency injection or singleton pattern
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // CURRENT USER ENDPOINTS
    // =========================
    
    // Get current authenticated user information
    // Without Spring: Would need manual session/token check and user lookup
    @GetMapping("/me")
    public AdminUserDTO getMe(Authentication auth) {
        return userService.getCurrentUser(auth);
    }

    // Get current user profile with statistics
    // Without Spring: Would need manual session retrieval and profile lookup
    @GetMapping("/profile")
    public UserProfileDTO getProfile(Authentication auth) {
        return userService.getCurrentProfile(auth);
    }

    // Update current user profile
    // Without Spring: Would need manual JSON parsing and profile update logic
    @PutMapping("/me")
    public AdminUserDTO updateMyProfile(Authentication auth, @RequestBody UpdateUserDTO dto) {
        return userService.updateMyProfile(auth, dto);
    }

    // =========================
    // ADMIN USER MANAGEMENT ENDPOINTS
    // =========================
    
    // Get all users (admin only)
    // Without Spring: Would need manual role checking and user list retrieval
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminUserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get specific user by ID (admin only)
    // Without Spring: Would need manual path variable extraction and role check
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Get user statistics by ID (admin only)
    // Without Spring: Would need manual stats calculation and role check
    @GetMapping("/{id}/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public UserStatsDTO getUserStats(@PathVariable Long id) {
        return userService.getUserStats(id);
    }

    // Update user by ID (admin only)
    // Without Spring: Would need manual JSON parsing, role check, and update logic
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO adminUpdateUser(@PathVariable Long id, @RequestBody UpdateUserDTO dto, Authentication auth) {
        return userService.adminUpdateUser(id, dto, auth.getName());
    }

    // Delete user by ID (admin only)
    // Without Spring: Would need manual role check and delete logic
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id, Authentication auth) {
        userService.deleteUser(id, auth.getName());
    }

    // Ban user by ID (admin only)
    // Without Spring: Would need manual role check and ban logic
    @PutMapping("/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO banUser(@PathVariable Long id, Authentication auth) {
        return userService.banUser(id, auth.getName());
    }

    // Unban user by ID (admin only)
    // Without Spring: Would need manual role check and unban logic
    @PutMapping("/{id}/unban")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO unbanUser(@PathVariable Long id, Authentication auth) {
        return userService.unbanUser(id, auth.getName());
    }

    // Reset user password by ID (admin only)
    // Without Spring: Would need manual parameter extraction, role check, and password reset
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminUserDTO resetPassword(@PathVariable Long id, @RequestParam String password, Authentication auth) {
        return userService.resetPassword(id, password, auth.getName());
    }
}