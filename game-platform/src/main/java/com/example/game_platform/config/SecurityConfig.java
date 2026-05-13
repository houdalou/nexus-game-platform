package com.example.game_platform.config;

import com.example.game_platform.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/* ========================================================================
 * SPRING SECURITY VS TRADITIONAL SERVLET APPROACH
 * ========================================================================
 * 
 * WITHOUT SPRING SECURITY (Traditional Servlet Approach):
 * 
 * 1. Manual Filter Chain:
 *    - Would need to create multiple ServletFilter classes
 *    - Each filter would need to be registered in web.xml
 *    - Manual ordering of filters in deployment descriptor
 *    - Example: AuthenticationFilter, AuthorizationFilter, LoggingFilter
 * 
 * 2. Session Management:
 *    - Would need to manually manage HttpSession
 *    - Manual session creation, validation, and invalidation
 *    - Manual session timeout handling
 *    - Manual session attribute storage (user data)
 *    - Risk of session fixation attacks if not handled properly
 * 
 * 3. Password Encoding:
 *    - Would need to manually implement password hashing
 *    - Manual salt generation and storage
 *    - Risk of weak hashing algorithms if not chosen carefully
 *    - Example: Manual MD5 or SHA-256 implementation (insecure)
 * 
 * 4. Authentication:
 *    - Manual extraction of credentials from request
 *    - Manual database lookup for user verification
 *    - Manual token generation and validation
 *    - Manual role checking in each protected resource
 * 
 * 5. Authorization:
 *    - Manual role checking in each Servlet/Filter
 *    - Manual URL pattern matching for access control
 *    - Risk of inconsistent authorization logic
 * 
 * WITH SPRING SECURITY:
 * 
 * 1. Automatic Filter Chain:
 *    - Spring Security automatically creates and orders filters
 *    - Built-in filters for common security tasks
 *    - Easy to customize with custom filters (like JwtAuthFilter)
 *    - No need for web.xml configuration
 * 
 * 2. Automatic Session Management:
 *    - Spring Security handles session creation automatically
 *    - Built-in session fixation protection
 *    - Configurable session policies (stateless for JWT)
 *    - Automatic session timeout handling
 * 
 * 3. Built-in Password Encoding:
 *    - BCryptPasswordEncoder provides secure hashing automatically
 *    - Automatic salt generation and storage
 *    - Industry-standard hashing algorithm
 *    - No manual implementation needed
 * 
 * 4. Declarative Authentication:
 *    - JWT filter automatically validates tokens
 *    - Automatic user loading from database
 *    - Automatic role assignment
 *    - No manual token parsing or validation
 * 
 * 5. Declarative Authorization:
 *    - @PreAuthorize annotations for method-level security
 *    - hasRole() expressions for URL-based security
 *    - Automatic role checking
 *    - Consistent authorization across the application
 * 
 * ADVANTAGES OF SPRING SECURITY:
 * - Reduced boilerplate code (no manual filter chains)
 * - Built-in security best practices (password encoding, session protection)
 * - Declarative configuration (annotations, fluent API)
 * - Automatic CSRF protection (can be disabled for REST APIs)
 * - Automatic CORS configuration
 * - Method-level security with @PreAuthorize
 * - Integration with Spring ecosystem
 * - Battle-tested and widely used
 * - Regular security updates from Spring team
 * ========================================================================
 */

// Security configuration for JWT authentication and authorization
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    // Constructor to inject JWT authentication filter
    // Without Spring: Would need manual dependency injection or singleton pattern
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    // Configure security filter chain for HTTP requests
    // Without Spring: Would need to configure filters in web.xml with manual ordering
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // CORS configuration
                // Without Spring: Would need manual CORS filter with origin checking
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF for REST API
                // Without Spring: Would need to disable CSRF manually in filter or not implement at all
                .csrf(csrf -> csrf.disable())

                // Set session management to stateless for JWT
                // Without Spring: Would need to manually avoid HttpSession creation and manage state manually
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Disable frame options for H2 console
                // Without Spring: Would need to manually set X-Frame-Options header
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        // Without Spring: Would need manual URL pattern matching in filter
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/stats/global").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/games").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/questions/**").permitAll()
                        .requestMatchers("/api/quiz/**").permitAll()
                        .requestMatchers("/api/scores/**").permitAll()
                        .requestMatchers("/api/arcade/**").authenticated()

                        // User interaction endpoints require authentication
                        // Without Spring: Would need manual session/token check in each Servlet
                        .requestMatchers("/api/favorites/**").authenticated()
                        .requestMatchers("/api/ratings/**").authenticated()
                        .requestMatchers("/api/comments/**").authenticated()

                        // User profile endpoints require authentication
                        // Without Spring: Would need manual session/token check in each Servlet
                        .requestMatchers("/api/users/me").authenticated()

                        // Admin only endpoints
                        // Without Spring: Would need manual role checking in each protected Servlet
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )

                // Add JWT filter before username password authentication filter
                // Without Spring: Would need to manually order filters in web.xml
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Configure CORS settings for cross-origin requests
    // Without Spring: Would need manual CORS filter with origin, method, and header validation
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // Password encoder bean for hashing passwords
    // Without Spring: Would need to manually implement password hashing with salt
    // Example risk: Using weak algorithms like MD5 or improper salt handling
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}