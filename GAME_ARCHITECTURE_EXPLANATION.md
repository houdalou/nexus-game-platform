# Game Backend Architecture & Data Flow Explanation

## Overview

**Important Note:** The backend does NOT implement the actual game logic for Tetris, Chess, or Snake. These games are entirely implemented on the frontend (React). The backend only manages game metadata, score processing, and user statistics.

---

## Backend Game Architecture

### 1. Game Entity (Metadata Only)

The `Game` entity stores only game metadata, not game logic:

```java
@Entity
public class Game {
    private Long id;
    private String title;           // e.g., "Chess", "Tetris", "Snake"
    private String description;     // Game description
    private String category;         // e.g., "Arcade", "Strategy"
    private String difficulty;      // e.g., "Easy", "Medium", "Hard"
    private Integer xpReward;       // XP reward for playing
    private String imageUrl;        // Game thumbnail
    private String slug;            // URL-friendly name
    private Boolean enabled;        // Whether game is available
}
```

**Purpose:** This allows admins to enable/disable games and configure their metadata without touching the frontend code.

---

### 2. Score Management System

The backend handles score submission and user progression through the `ScoreService`.

#### Score Entity
```java
@Entity
public class Score {
    private Long id;
    private int points;             // Score points
    private String gameType;        // e.g., "CHESS", "TETRIS", "SNAKE"
    private double percentile;      // For future use
    @ManyToOne
    private User user;             // Who achieved this score
}
```

#### Score Processing Flow

**For Arcade Games (Chess, Tetris, Snake):**

1. **Frontend** completes game → calculates final score
2. **Frontend** sends score to backend:
   ```
   POST /api/arcade/score
   Parameters: points=100, gameType="CHESS"
   Headers: Authorization: Bearer <JWT token>
   ```

3. **Backend** (ArcadeController):
   ```java
   @PostMapping("/score")
   public Score submitScore(
       @RequestParam int points,
       @RequestParam String gameType,
       Authentication authentication
   ) {
       String username = authentication.getName();
       return scoreService.saveArcadeScore(username, points, gameType);
   }
   ```

4. **Backend** (ScoreService.saveArcadeScore):
   - Retrieves user from database
   - Updates user's total score: `totalScore += points`
   - Calculates XP gained: `xpGained = points / 5` (proportional to score)
   - Updates user's XP: `xp += xpGained`
   - Calculates new level: `level = (xp / 100) + 1`
   - Updates user's badge based on XP thresholds:
     - 0-99 XP: BRONZE
     - 100-299 XP: SILVER
     - 300-599 XP: GOLD
     - 600-999 XP: PLATINUM
     - 1000+ XP: DIAMOND
   - Saves updated user to database
   - Creates Score record with points and gameType
   - Saves Score to database

**For Quiz Games:**

Similar flow but with difficulty-based XP:
- EASY: 10 XP
- MEDIUM: 20 XP
- HARD: 40 XP

---

### 3. Complete Data Flow (Flux)

#### Game Initialization Flow

```
1. User logs in → JWT token generated
2. Frontend fetches available games:
   GET /api/games
   → Backend returns enabled games list
3. User selects game (e.g., Chess)
4. Frontend loads Chess.jsx component
5. Frontend initializes game state
6. Game runs entirely on frontend (React state, canvas, etc.)
```

#### Gameplay Flow

```
1. User plays game on frontend
2. Game logic runs in browser (no backend interaction)
3. Game state updates locally (React hooks)
4. Game renders to canvas/DOM
5. No API calls during gameplay
```

#### Score Submission Flow

```
1. Game ends (win/lose/game over)
2. Frontend calculates final score
3. Frontend sends score to backend:
   POST /api/arcade/score
   Body: { points: 100, gameType: "CHESS" }
   Headers: { Authorization: "Bearer <jwt>" }
   
4. Backend processes score:
   a. JWT filter validates token
   b. ArcadeController receives request
   c. ScoreService.saveArcadeScore executes:
      - Find user by username
      - Update totalScore += points
      - Calculate XP = points / 5
      - Update XP += XP
      - Calculate level = XP / 100 + 1
      - Update badge based on XP
      - Save user to database
      - Create Score record
      - Save Score to database
   d. Return Score object to frontend

5. Frontend receives confirmation
6. Frontend updates local state
7. Frontend shows score/results screen
```

#### Leaderboard Flow

```
1. User navigates to leaderboard page
2. Frontend requests leaderboard:
   GET /api/scores/leaderboard
   
3. Backend processes:
   a. ScoreService.getTopScores executes
   b. Query: findTop10ByOrderByTotalScoreDesc()
   c. Map users to LeaderboardEntryDTO
   d. Return top 10 users with stats
   
4. Frontend displays leaderboard
```

---

## Backend vs Frontend Responsibilities

### Frontend (React)
- **Game Logic:** Complete implementation of Chess, Tetris, Snake, Quiz
- **Game State:** Managing game state with React hooks
- **Rendering:** Canvas drawing, DOM manipulation
- **User Interaction:** Keyboard/mouse handling
- **Score Calculation:** Calculating final score based on game rules
- **API Calls:** Submitting scores, fetching games/leaderboard

### Backend (Spring Boot)
- **Authentication:** JWT token validation
- **Game Metadata:** Managing game information
- **Score Processing:** Calculating XP, level, badge
- **User Statistics:** Tracking total score, XP, level, badge
- **Score History:** Storing individual score records
- **Leaderboard:** Providing top players data
- **Admin Features:** Enable/disable games, manage users

---

## Specific Game Examples

### Chess Game

**Frontend (Chess.jsx):**
- Implements chess board, pieces, moves
- Validates chess rules
- Handles AI opponent logic
- Calculates win/loss
- Determines score based on result

**Backend:**
- Receives score via `/api/arcade/score`
- gameType = "CHESS"
- Processes score: `totalScore += points`, `xp += points/5`
- Stores score history

**No chess-specific backend logic exists.**

### Tetris Game

**Frontend (Tetris.jsx):**
- Implements tetromino pieces
- Handles piece movement, rotation
- Collision detection
- Line clearing
- Score calculation based on lines cleared

**Backend:**
- Receives score via `/api/arcade/score`
- gameType = "TETRIS"
- Processes score: `totalScore += points`, `xp += points/5`
- Stores score history

**No tetris-specific backend logic exists.**

### Snake Game

**Frontend (Snake.jsx):**
- Implements snake movement
- Food generation
- Collision detection
- Score calculation
- Obstacles and bombs (added enhancements)

**Backend:**
- Receives score via `/api/arcade/score`
- gameType = "SNAKE"
- Processes score: `totalScore += points`, `xp += points/5`
- Stores score history

**No snake-specific backend logic exists.**

---

## API Endpoints Summary

### Game Management
- `GET /api/games` - Get enabled games (public)
- `GET /api/games/admin` - Get all games (admin)
- `POST /api/games` - Create game (admin)
- `PUT /api/games/{id}` - Update game (admin)
- `DELETE /api/games/{id}` - Delete game (admin)
- `PUT /api/games/{id}/toggle` - Toggle enabled (admin)

### Score Management
- `POST /api/scores` - Submit score (quiz games)
- `GET /api/scores/leaderboard` - Get top 10 players
- `POST /api/arcade/score` - Submit arcade game score

---

## Database Schema

### Game Table
```sql
CREATE TABLE games (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    xp_reward INTEGER,
    image_url VARCHAR(500),
    slug VARCHAR(100),
    enabled BOOLEAN
);
```

### Score Table
```sql
CREATE TABLE scores (
    id BIGINT PRIMARY KEY,
    points INTEGER NOT NULL,
    game_type VARCHAR(50),
    percentile DOUBLE,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### User Table (relevant fields)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50),
    total_score INTEGER DEFAULT 0,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badge VARCHAR(50),
    banned BOOLEAN DEFAULT FALSE
);
```

---

## Security Flow

1. **User Login:**
   - POST `/api/auth/login`
   - Backend validates credentials
   - Backend generates JWT token
   - Frontend stores token in localStorage

2. **Game Access:**
   - Frontend includes JWT in Authorization header
   - JWT filter validates token on each request
   - User identity extracted from token
   - Score submission requires valid token

3. **Admin Operations:**
   - Admin endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`
   - Only admins can manage games
   - All admin actions logged in AuditLog

---

## Summary

**Key Points:**
1. **Game logic is 100% frontend** - React implements Chess, Tetris, Snake
2. **Backend is data-centric** - Manages scores, users, game metadata
3. **Flux is simple:** Frontend game → Score → Backend → XP/Level/Badge → Database
4. **No game-specific backend code** - All games use same score submission endpoint
5. **Scalable architecture** - Easy to add new games without backend changes

**Why This Architecture:**
- Separates concerns (game logic vs data management)
- Frontend can update game logic independently
- Backend focuses on authentication, data persistence, and statistics
- Reduces backend complexity
- Allows for multiple game types with unified scoring system
