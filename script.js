// Default games that come with the platform
const defaultGames = [
    {
        id: 6,
        title: 'FUNNY MAN SHOOTER',
        category: 'action',
        description: 'Hilarious shooting action game',
        type: 'url',
        url: 'https://funnyshooter.gitlab.io/'
    },
    {
        id: 7,
        title: 'RANDOM GAMES',
        category: 'action',
        description: 'Collection of random games',
        type: 'url',
        url: 'https://git-hub-games.github.io/'
    },
    {
        id: 8,
        title: 'SHELLSHOCKERS',
        category: 'action',
        description: 'Egg-based multiplayer shooter game',
        type: 'url',
        url: 'https://shellplay.org/'
    },
    {
        id: 9,
        title: 'SPACE WAVES',
        category: 'action',
        description: 'Space-themed action arcade game',
        type: 'url',
        url: 'https://space-waves-unblocked.github.io/space-waves/'
    }
];

// Game management
class GameManager {
    constructor() {
        this.games = this.loadGames();
        this.currentFilter = 'all';
    }

    loadGames() {
        const stored = localStorage.getItem('nexusGames');
        return stored ? JSON.parse(stored) : [...defaultGames];
    }

    saveGames() {
        localStorage.setItem('nexusGames', JSON.stringify(this.games));
    }

    addGame(gameData) {
        const newGame = {
            id: Date.now(),
            ...gameData
        };
        this.games.push(newGame);
        this.saveGames();
        return newGame;
    }

    getFilteredGames(filter) {
        if (filter === 'all') return this.games;
        return this.games.filter(g => g.category === filter);
    }

    searchGames(query) {
        return this.games.filter(g => 
            g.title.toLowerCase().includes(query.toLowerCase()) ||
            g.description.toLowerCase().includes(query.toLowerCase())
        );
    }
}

const gameManager = new GameManager();

// DOM Elements
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const gameModal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');
const gameCounts = document.getElementById('game-count');
const surveyBtn = document.getElementById('surveyBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let currentGame = null;

// Initialize
function init() {
    renderGames();
    setupEventListeners();
    updateGameCount();
    setupCalculatorWidget();
}

// Setup event listeners
function setupEventListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    searchInput.addEventListener('input', handleSearch);

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleTabSwitch(e.target.dataset.tab);
        });
    });

    // Survey button
    if (surveyBtn) {
        surveyBtn.addEventListener('click', () => {
            window.open('https://forms.gle/BQk22GNrgejdEQwn7', '_blank');
        });
    }

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Fullscreen button
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    window.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeModals();
        }
    });
}

// Setup Calculator Widget
function setupCalculatorWidget() {
    const calcToggleBtn = document.getElementById('calcToggleBtn');
    const calcCloseBtn = document.getElementById('calcCloseBtn');
    const calcContainer = document.getElementById('calcContainer');

    calcToggleBtn.addEventListener('click', () => {
        if (calcContainer.style.display === 'none') {
            calcContainer.style.display = 'block';
            calcToggleBtn.textContent = 'CLOSE';
        } else {
            calcContainer.style.display = 'none';
            calcToggleBtn.textContent = 'CALC';
        }
    });

    calcCloseBtn.addEventListener('click', () => {
        calcContainer.style.display = 'none';
        calcToggleBtn.textContent = 'CALC';
    });
}

// Render games to grid
function renderGames(gamesToRender = gameManager.games) {
    gamesGrid.innerHTML = '';

    if (gamesToRender.length === 0) {
        gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #00ff88; padding: 40px;">NO GAMES FOUND...</div>';
        return;
    }

    gamesToRender.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Create game card DOM element
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-title">${game.title}</div>
        <div class="game-category">${game.category.toUpperCase()}</div>
        <div class="game-description">${game.description}</div>
        <div class="game-status">READY</div>
    `;

    card.addEventListener('click', () => launchGame(game));
    return card;
}

// Launch game
function launchGame(game) {
    currentGame = game;

    if (game.type === 'builtin') {
        launchBuiltinGame(game.game);
    } else if (game.type === 'url') {
        launchExternalGame(game.url);
    }

    gameModal.style.display = 'block';
}

// Launch external game
function launchExternalGame(url) {
    gameContainer.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none; border-radius: 3px;"></iframe>`;
}

// Launch builtin games
function launchBuiltinGame(gameName) {
    switch(gameName) {
        case 'snake':
            gameContainer.innerHTML = '';
            new SnakeGame(gameContainer);
            break;
        case 'pong':
            gameContainer.innerHTML = '';
            new PongGame(gameContainer);
            break;
        case 'tetris':
            gameContainer.innerHTML = '';
            new TetrisGame(gameContainer);
            break;
    }
}

// Filter games
function handleFilter(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    gameManager.currentFilter = e.target.dataset.filter;
    renderGames(gameManager.getFilteredGames(gameManager.currentFilter));
}

// Search games
function handleSearch(e) {
    const query = e.target.value;
    if (query.trim() === '') {
        renderGames(gameManager.getFilteredGames(gameManager.currentFilter));
    } else {
        renderGames(gameManager.searchGames(query));
    }
}

// Add game modals
// [DEPRECATED - Now using Game Manager Tab]

function closeModals() {
    gameModal.style.display = 'none';
    gameModal.classList.remove('fullscreen');
    if (fullscreenBtn) {
        fullscreenBtn.classList.remove('active');
        fullscreenBtn.textContent = '⛶ FULLSCREEN';
    }
}

function toggleFullscreen() {
    gameModal.classList.toggle('fullscreen');
    if (gameModal.classList.contains('fullscreen')) {
        fullscreenBtn.classList.add('active');
        fullscreenBtn.textContent = '⛶ EXIT FULLSCREEN';
        // Handle keyboard escape key
        document.addEventListener('keydown', handleFullscreenEscape);
    } else {
        fullscreenBtn.classList.remove('active');
        fullscreenBtn.textContent = '⛶ FULLSCREEN';
        document.removeEventListener('keydown', handleFullscreenEscape);
    }
}

function handleFullscreenEscape(e) {
    if (e.key === 'Escape') {
        gameModal.classList.remove('fullscreen');
        fullscreenBtn.classList.remove('active');
        fullscreenBtn.textContent = '⛶ FULLSCREEN';
        document.removeEventListener('keydown', handleFullscreenEscape);
    }
}

function updateGameCount() {
    gameCounts.textContent = gameManager.games.length;
    document.getElementById('sidebarGameCount').textContent = gameManager.games.length;
}

// Tab switching in Game Manager
function handleTabSwitch(tabName) {
    // Update tab buttons
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabName === 'view-mode' ? 'viewMode' : 'addMode').classList.add('active');
}

// Handle Game Manager Form Submission
function handleGameManagerSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('gmName').value.trim();
    const url = document.getElementById('gmUrl').value.trim();
    const description = document.getElementById('gmDescription').value.trim();
    const category = document.getElementById('gmCategory').value;

    if (!name || !url) {
        alert('Please fill in Name and URL fields');
        return;
    }

    // Validate URL
    const fullUrl = url.startsWith('http') ? url : 'https://' + url;

    const gameData = {
        title: name.toUpperCase(),
        category: category,
        description: description || 'Custom game added via manager',
        type: 'url',
        url: fullUrl
    };

    gameManager.addGame(gameData);
    gameManagerForm.reset();
    renderGames();
    updateGameCount();

    // Visual feedback
    const btn = document.querySelector('.gm-submit-btn');
    const originalText = btn.textContent;
    btn.textContent = 'DEPLOYED!';
    setTimeout(() => { btn.textContent = originalText; }, 1500);
}

// ============ BUILTIN GAMES ============

// SNAKE GAME
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#0a0e27';
        this.canvas.style.border = '2px solid #00ff88';
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.setup();
    }

    setup() {
        this.gridSize = 20;
        this.cols = Math.floor(this.canvas.width / this.gridSize);
        this.rows = Math.floor(this.canvas.height / this.gridSize);
        this.snake = [{x: Math.floor(this.cols/2), y: Math.floor(this.rows/2)}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = this.randomFood();
        this.score = 0;
        this.gameOver = false;

        document.addEventListener('keydown', (e) => this.handleInput(e));
        this.gameLoop();
    }

    handleInput(e) {
        const arrows = {
            'ArrowUp': {x: 0, y: -1},
            'ArrowDown': {x: 0, y: 1},
            'ArrowLeft': {x: -1, y: 0},
            'ArrowRight': {x: 1, y: 0}
        };

        if (arrows[e.key]) {
            e.preventDefault();
            this.nextDirection = arrows[e.key];
        }
    }

    randomFood() {
        return {
            x: Math.floor(Math.random() * this.cols),
            y: Math.floor(Math.random() * this.rows)
        };
    }

    update() {
        if (this.gameOver) return;

        if (this.isOpposite(this.nextDirection, this.direction)) {
            this.nextDirection = this.direction;
        }
        this.direction = this.nextDirection;

        const head = this.snake[0];
        const newHead = {
            x: (head.x + this.direction.x + this.cols) % this.cols,
            y: (head.y + this.direction.y + this.rows) % this.rows
        };

        if (this.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(newHead);

        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.food = this.randomFood();
            this.score += 10;
        } else {
            this.snake.pop();
        }
    }

    isOpposite(dir1, dir2) {
        return dir1.x === -dir2.x && dir1.y === -dir2.y;
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }

        // Draw snake
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#00ff88' : '#00dd77';
            this.ctx.shadowColor = index === 0 ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 221, 119, 0.4)';
            this.ctx.shadowBlur = index === 0 ? 10 : 5;
            this.ctx.fillRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
        });

        // Draw food
        this.ctx.fillStyle = '#ff0055';
        this.ctx.shadowColor = 'rgba(255, 0, 85, 0.8)';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );

        // Draw score
        this.ctx.shadowColor = 'none';
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = 'bold 16px Courier New';
        this.ctx.fillText(`SCORE: ${this.score}`, 10, 25);

        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ff0055';
            this.ctx.font = 'bold 40px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
            this.ctx.fillStyle = '#00ff88';
            this.ctx.font = '20px Courier New';
            this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), 100);
    }
}

// PONG GAME
class PongGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#0a0e27';
        this.canvas.style.border = '2px solid #00ff88';
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.setup();
    }

    setup() {
        this.paddleHeight = 80;
        this.paddleWidth = 10;
        this.ballSize = 8;

        this.player = { y: this.canvas.height / 2 - this.paddleHeight / 2, score: 0 };
        this.ai = { y: this.canvas.height / 2 - this.paddleHeight / 2, score: 0 };
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: 5,
            vy: 5
        };

        document.addEventListener('mousemove', (e) => {
            this.player.y = e.clientY - this.canvas.getBoundingClientRect().top - this.paddleHeight / 2;
        });

        this.gameLoop();
    }

    update() {
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        if (this.ball.y < 0 || this.ball.y > this.canvas.height) {
            this.ball.vy *= -1;
        }

        if (this.ball.x < 20 && this.ball.y > this.player.y && this.ball.y < this.player.y + this.paddleHeight) {
            this.ball.vx *= -1;
            this.ball.vx *= 1.05;
        }

        if (this.ball.x > this.canvas.width - 20 && this.ball.y > this.ai.y && this.ball.y < this.ai.y + this.paddleHeight) {
            this.ball.vx *= -1;
            this.ball.vx *= 1.05;
        }

        this.ai.y += (this.ball.y - (this.ai.y + this.paddleHeight / 2)) * 0.06;

        if (this.ball.x < 0) {
            this.ai.score++;
            this.resetBall();
        }
        if (this.ball.x > this.canvas.width) {
            this.player.score++;
            this.resetBall();
        }
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.ball.vy = (Math.random() - 0.5) * 6;
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Center line
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.2)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Paddles
        this.ctx.fillStyle = '#00ff88';
        this.ctx.shadowColor = 'rgba(0, 255, 136, 0.8)';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(10, this.player.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - 20, this.ai.y, this.paddleWidth, this.paddleHeight);

        // Ball
        this.ctx.fillStyle = '#ff0055';
        this.ctx.shadowColor = 'rgba(255, 0, 85, 0.8)';
        this.ctx.fillRect(this.ball.x - this.ballSize / 2, this.ball.y - this.ballSize / 2, this.ballSize, this.ballSize);

        // Score
        this.ctx.shadowColor = 'none';
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = 'bold 32px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.player.score, this.canvas.width / 4, 50);
        this.ctx.fillText(this.ai.score, (this.canvas.width * 3) / 4, 50);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// TETRIS GAME
class TetrisGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 300;
        this.canvas.height = 400;
        this.canvas.style.display = 'block';
        this.canvas.style.background = '#0a0e27';
        this.canvas.style.border = '2px solid #00ff88';
        this.canvas.style.margin = '50px auto';
        container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.setup();
    }

    setup() {
        this.cols = 10;
        this.rows = 20;
        this.cellSize = this.canvas.width / this.cols;
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.pieces = this.getPieces();
        this.currentPiece = this.getRandomPiece();
        this.score = 0;
        this.gameOver = false;

        document.addEventListener('keydown', (e) => this.handleInput(e));
        this.gameLoop();
    }

    getPieces() {
        return {
            I: [[1,1,1,1]],
            L: [[1,0],[1,0],[1,1]],
            Z: [[1,1,0],[0,1,1]],
            T: [[0,1,0],[1,1,1]],
            O: [[1,1],[1,1]],
            S: [[0,1,1],[1,1,0]],
            J: [[0,1],[0,1],[1,1]]
        };
    }

    getRandomPiece() {
        const keys = Object.keys(this.pieces);
        const type = keys[Math.floor(Math.random() * keys.length)];
        return {
            type,
            shape: this.pieces[type],
            x: 4,
            y: 0
        };
    }

    handleInput(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
        }
    }

    movePiece(dx, dy) {
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        if (this.collision()) {
            this.currentPiece.x -= dx;
            this.currentPiece.y -= dy;
            if (dy > 0) this.lockPiece();
        }
    }

    rotatePiece() {
        const original = this.currentPiece.shape;
        this.currentPiece.shape = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        if (this.collision()) {
            this.currentPiece.shape = original;
        }
    }

    collision() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    if (boardX < 0 || boardX >= this.cols || boardY >= this.rows) return true;
                    if (boardY >= 0 && this.board[boardY][boardX]) return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY < 0) {
                        this.gameOver = true;
                        return;
                    }
                    this.board[boardY][boardX] = 1;
                }
            }
        }
        this.clearLines();
        this.currentPiece = this.getRandomPiece();
    }

    clearLines() {
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                this.score += 100;
                y++;
            }
        }
    }

    update() {
        if (this.gameOver) return;
        this.movePiece(0, 1);
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }

        // Draw board
        this.ctx.fillStyle = '#00dd77';
        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.ctx.shadowColor = 'rgba(0, 255, 136, 0.6)';
                    this.ctx.shadowBlur = 8;
                    this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
                }
            });
        });

        // Draw current piece
        this.ctx.fillStyle = '#00ff88';
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.ctx.shadowColor = 'rgba(0, 255, 136, 0.8)';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fillRect((this.currentPiece.x + x) * this.cellSize + 1, (this.currentPiece.y + y) * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
                }
            });
        });

        // Score
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ff0055';
            this.ctx.font = 'bold 24px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = 'rgba(255, 0, 85, 0.8)';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.fillStyle = '#00ff88';
            this.ctx.font = '16px Courier New';
            this.ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
            this.ctx.fillText(`SCORE: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => this.gameLoop(), 500);
    }
}

// Start the app
init();
