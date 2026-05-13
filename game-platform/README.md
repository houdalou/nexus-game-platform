# NEXUS Game Platform - Backend

A competitive gaming platform backend built with Spring Boot, featuring user management, game administration, analytics, and comprehensive audit logging.

## Tech Stack

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** (JWT authentication)
- **Spring Data JPA** (Hibernate)
- **PostgreSQL** (or H2 for development)
- **Maven** (build tool)
- **Lombok** (code generation)

## Project Structure

```
game-platform/
├── src/main/java/com/example/game_platform/
│   ├── GamePlatformApplication.java      # Main application entry point
│   ├── config/
│   │   └── SecurityConfig.java            # Security configuration, JWT filter, CORS
│   ├── controller/                        # REST API endpoints
│   │   ├── AnswerController.java
│   │   ├── ArcadeController.java
│   │   ├── AuditLogController.java        # Admin audit log endpoints
│   │   ├── AuthController.java            # Login/Register endpoints
│   │   ├── GameController.java           # Game CRUD operations
│   │   ├── QuestionController.java
│   │   ├── QuizController.java
│   │   ├── QuizSessionController.java
│   │   ├── ScoreController.java
│   │   ├── StatsController.java            # Analytics endpoints
│   │   └── UserController.java            # User management
│   ├── dto/                               # Data Transfer Objects
│   │   ├── AdminUserDTO.java              # Admin user view with stats
│   │   ├── GameDTO.java
│   │   ├── GlobalStatsDTO.java
│   │   ├── LeaderboardEntryDTO.java       # Leaderboard entries
│   │   ├── PopularGameDTO.java
│   │   ├── TopPlayerDTO.java
│   │   ├── UpdateUserDTO.java
│   │   ├── UserStatsDTO.java
│   │   └── UserProfileDTO.java
│   ├── entity/                            # Database entities
│   │   ├── Answer.java
│   │   ├── AuditLog.java                  # Admin action audit log
│   │   ├── DifficultyLevel.java           # Enum: EASY, MEDIUM, HARD
│   │   ├── Game.java                      # Game entity with enabled flag
│   │   ├── Question.java
│   │   ├── QuizSession.java
│   │   ├── Rank.java                      # Enum: BRONZE, SILVER, GOLD, PLATINUM, DIAMOND
│   │   ├── Role.java                      # Enum: USER, ADMIN
│   │   ├── Score.java
│   │   └── User.java                      # User entity with banned flag, XP, level, badge
│   ├── repository/                        # JPA repositories
│   │   ├── AnswerRepository.java
│   │   ├── AuditLogRepository.java
│   │   ├── GameRepository.java
│   │   ├── QuestionRepository.java
│   │   ├── QuizSessionRepository.java
│   │   ├── ScoreRepository.java
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtAuthFilter.java             # JWT authentication filter
│   │   └── JwtUtil.java                   # JWT token generation/validation
│   └── service/                           # Business logic layer
│       ├── AuditLogService.java           # Audit logging service
│       ├── AuthService.java               # Registration/login logic
│       ├── CustomUserDetailsService.java   # User details for Spring Security
│       ├── GameService.java               # Game management with audit logging
│       ├── ScoreService.java              # Score calculation and leaderboard
│       ├── StatsService.java              # Analytics and statistics
│       └── UserService.java               # User management with audit logging
├── src/main/resources/
│   ├── application.properties             # Database and app configuration
│   └── data.sql                           # Initial data (optional)
└── pom.xml                               # Maven dependencies
```

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (USER, ADMIN)
- User registration and login
- Password encryption with BCrypt

### User Management
- User profile management
- Admin user CRUD operations
- Ban/unban users
- Password reset by admin
- User statistics (XP, level, badge, total score)

### Game Management
- Game CRUD operations (admin only)
- Enable/disable games
- Game difficulty and XP reward configuration
- Public game listing (enabled games only)

### Scoring System
- Score submission for games
- Automatic XP and level calculation
- Badge progression (BRONZE → DIAMOND)
- Global leaderboard (top 10)

### Analytics
- Global platform statistics
- Top players
- Popular games
- Average scores

### Audit Logging
- Admin action tracking (create, update, delete, ban, enable/disable)
- Timestamped logs with admin username, action, target, and details
- Filterable by admin, action type, or date range

## API Endpoints

### Public Endpoints
```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login (returns JWT)
GET    /api/stats/global           # Global platform statistics
GET    /api/games                   # List enabled games
GET    /api/questions/**           # Quiz questions
GET    /api/quiz/**                 # Quiz endpoints
GET    /api/scores/leaderboard      # Global leaderboard
```

### Authenticated User Endpoints
```
GET    /api/users/me                # Current user info
GET    /api/users/profile           # Current user profile
PUT    /api/users/me                # Update own profile
POST   /api/scores                  # Submit score
POST   /api/arcade/score            # Submit arcade game score
```

### Admin Endpoints (ADMIN role required)
```
GET    /api/users                    # List all users
GET    /api/users/{id}              # Get user by ID
GET    /api/users/{id}/stats        # Get user statistics
PUT    /api/users/{id}              # Update user
DELETE /api/users/{id}              # Delete user
PUT    /api/users/{id}/ban          # Ban user
PUT    /api/users/{id}/unban        # Unban user
PUT    /api/users/{id}/reset-password  # Reset user password

GET    /api/games/admin             # List all games (including disabled)
POST   /api/games                   # Create game
PUT    /api/games/{id}              # Update game
DELETE /api/games/{id}              # Delete game
PUT    /api/games/{id}/toggle       # Toggle game enabled status

GET    /api/admin/audit             # Get all audit logs
GET    /api/admin/audit/recent/{days}  # Get recent logs (last N days)
GET    /api/admin/audit/admin/{username}  # Get logs by admin
GET    /api/admin/audit/action/{action}  # Get logs by action type
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- PostgreSQL 14+ (or use H2 for development)

### Database Configuration

**PostgreSQL (Production):**
```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexus_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**H2 (Development):**
```properties
spring.datasource.url=jdbc:h2:mem:nexusdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

### Running the Application

**Using Maven:**
```bash
cd game-platform
./mvnw spring-boot:run
```

**Using IDE:**
- Import as Maven project
- Run `GamePlatformApplication.java`

The application will start on `http://localhost:8080`

## Environment Variables

```properties
# Server
server.port=8080

# JWT
jwt.secret=your-secret-key-at-least-256-bits
jwt.expiration=86400000  # 24 hours in milliseconds

# CORS
cors.allowed-origins=http://localhost:3000
```

## Security

- JWT tokens expire after 24 hours
- Passwords are encrypted with BCrypt
- Admin-only endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`
- CORS configured for frontend origin

## Audit Log Actions

The following admin actions are logged:
- `USER_CREATED` - New user registration
- `USER_UPDATED` - User profile updated by admin
- `USER_DELETED` - User deleted by admin
- `BAN_USER` - User banned by admin
- `UNBAN_USER` - User unbanned by admin
- `RESET_PASSWORD` - User password reset by admin
- `GAME_CREATED` - Game created by admin
- `GAME_UPDATED` - Game updated by admin
- `GAME_DELETED` - Game deleted by admin
- `GAME_ENABLED` - Game enabled by admin
- `GAME_DISABLED` - Game disabled by admin

## Testing

```bash
# Run all tests
./mvnw test

# Run specific test
./mvnw test -Dtest=UserServiceTest
```

## License

MIT License
