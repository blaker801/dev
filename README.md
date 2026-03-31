# 🔓 NEXUS PORT - Unblocked Games Terminal

A hacker-themed unblocked games portal with an awesome retro terminal aesthetic. Built with vanilla HTML, CSS, and JavaScript.

## 🚀 Features

- **Terminal Aesthetic**: Green-on-black hacker interface with authentic CRT effects
- **5 Pre-loaded Games**: Snake, Pong, Tetris, Pacman, and 2048
- **Easy Game Management**: 
  - Add new games with a simple form
  - Games are stored in local browser storage (persistent across sessions)
  - Support for embedding external game URLs
  - Search and filter games by category
- **No Backend Required**: Everything runs in the browser
- **Responsive Design**: Works on different screen sizes

## 🎮 Pre-installed Games

1. **SNAKE.EXE** - Classic snake game (arrow keys to move)
2. **PONG.SYS** - Play pong against AI (mouse to move paddle)
3. **TETRIS.APP** - Stack the blocks (arrow keys to control)
4. **PACMAN.BIN** - Classic Pacman (external link)
5. **2048.COM** - Combine tiles (external link)

## 📖 How to Use

### Running the Website

Simply open `index.html` in your browser:
```bash
# Using Python's simple HTTP server (recommended)
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

Or open directly in your browser (some features work better with a server).

### Adding New Games

#### Method 1: Using the UI
1. Click the **[ADD NEW GAME]** button at the bottom
2. Fill in:
   - **Game Title**: Name of your game
   - **Category**: action, puzzle, classic, or other
   - **Game URL**: Link to the game or HTML content
   - **Description**: Brief description
3. Click **ADD GAME**
4. The game will appear in your library

#### Method 2: Manual JSON (Advanced)
Edit the games directly in `script.js`:

```javascript
const defaultGames = [
    {
        id: 1,
        title: 'YOUR GAME NAME',
        category: 'action', // or 'puzzle', 'classic'
        description: 'Game description',
        type: 'url',
        url: 'https://game-url-here.com'
    },
    // ... more games
];
```

### Game Categories

- **ACTION**: Fast-paced, reflex-based games
- **PUZZLE**: Brain teasers, logic games
- **CLASSIC**: Retro, timeless games
- **OTHER**: Everything else

## 🛠️ Customization

### Change Colors
Edit `style.css` and look for color values:
- `#00ff88` = Main green
- `#00ffff` = Cyan accents
- `#ff0055` = Red for emphasis

### Add Built-in Games
Add new game classes in `script.js` similar to `SnakeGame`, `PongGame`, or `TetrisGame`:

```javascript
class MyGame {
    constructor(container) {
        this.container = container;
        // Your game code here
    }
}
```

## 📊 Game Data Storage

All user-added games are stored in **localStorage**:
- Persists across browser sessions
- ~5-10MB limit per domain
- Gets cleared if browser cache is cleared

To reset to default games:
```javascript
// In browser console:
localStorage.removeItem('nexusGames');
location.reload();
```

## 🎨 File Structure

```
/
├── index.html          # Main HTML structure
├── style.css           # Hacker theme styling
├── script.js           # Game management + built-in games
└── README.md           # This file
```

## 💡 Tips

- Press `F11` for fullscreen immersion
- Use keyboard shortcuts in games:
  - Snake: Arrow keys
  - Pong: Mouse movement
  - Tetris: Arrow keys + Up to rotate
- Filter games by category using the left panel
- Search for games using the search bar

---

**NEXUS PORT v2.4.1** - Access Granted ✓
