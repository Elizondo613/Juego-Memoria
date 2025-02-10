const symbols = ['△', '○', '□', '◇', '♡', '☆', '♣', '♠', '♦', '♫', '☼', '☸', '☯', '⚡', '☎', '✈'];

class MemoryGame {
    constructor() {
        this.gameBoard = document.getElementById('gameBoard');
        this.movesElement = document.getElementById('moves');
        this.timerElement = document.getElementById('timer');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.matches = 0;
        this.isLocked = false;
        this.timer = null;
        this.seconds = 0;
        
        this.difficulties = {
            easy: { pairs: 6, columns: 4 },
            medium: { pairs: 8, columns: 4 },
            hard: { pairs: 12, columns: 6 }
        };
        
        this.currentDifficulty = 'easy';
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setDifficulty(button.dataset.difficulty);
            });
        });
        
        this.startGame();
    }
    
    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.difficultyButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.difficulty === difficulty);
        });
        this.startGame();
    }
    
    startGame() {
        // Reset game state
        this.clearTimer();
        this.moves = 0;
        this.matches = 0;
        this.seconds = 0;
        this.movesElement.textContent = '0';
        this.timerElement.textContent = '0:00';
        this.gameBoard.innerHTML = '';
        this.flippedCards = [];
        this.isLocked = false;
        
        // Generate cards
        const pairs = this.difficulties[this.currentDifficulty].pairs;
        const columns = this.difficulties[this.currentDifficulty].columns;
        this.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        const gameSymbols = [...symbols.slice(0, pairs)];
        const cardSymbols = [...gameSymbols, ...gameSymbols];
        this.shuffleArray(cardSymbols);
        
        cardSymbols.forEach((symbol, index) => {
            const card = this.createCard(symbol, index);
            this.gameBoard.appendChild(card);
        });
        
        // Start timer
        this.startTimer();
    }
    
    createCard(symbol, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${symbol}</div>
        `;
        
        card.addEventListener('click', () => this.flipCard(card, symbol));
        return card;
    }
    
    flipCard(card, symbol) {
        if (this.isLocked || card.classList.contains('flipped') || 
            this.flippedCards.length === 2) return;
        
        card.classList.add('flipped');
        this.flippedCards.push({ card, symbol });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.symbol === card2.symbol;
        
        this.isLocked = true;
        setTimeout(() => {
            if (match) {
                this.matches++;
                if (this.matches === this.difficulties[this.currentDifficulty].pairs) {
                    this.gameWon();
                }
            } else {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
            }
            
            this.flippedCards = [];
            this.isLocked = false;
        }, 1000);
    }
    
    gameWon() {
        this.clearTimer();
        setTimeout(() => {
            alert(`¡Felicitaciones! Has ganado en ${this.moves} movimientos y ${this.formatTime(this.seconds)}`);
        }, 500);
    }
    
    startTimer() {
        this.clearTimer();
        this.timer = setInterval(() => {
            this.seconds++;
            this.timerElement.textContent = this.formatTime(this.seconds);
        }, 1000);
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});