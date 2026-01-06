// DOM Elements
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const attemptsEl = document.getElementById("attempts");
const highScoreEl = document.getElementById("highScore");
const historyList = document.getElementById("historyList");
const difficultyBtns = document.querySelectorAll(".difficulty button");

// Game State
let maxNumber = 100;
let attempts = 0;
let randomNumber;
let currentDifficulty = "medium";

// Attempt limits per difficulty
const attemptLimits = {
    easy: 10,
    medium: 7,
    hard: 5
};

// Init
resetGame();
loadHighScore();

// Generate random number
function generateRandom(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Difficulty selection
difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        difficultyBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        maxNumber = parseInt(btn.dataset.max);
        currentDifficulty = btn.textContent.toLowerCase();
        resetGame();
        loadHighScore();
    });
});

// Guess logic
function handleGuess() {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess)) {
        message.textContent = "⚠️ Enter a valid number";
        return;
    }

    attempts++;
    attemptsEl.textContent = attempts;

    if (guess === randomNumber) {
        message.textContent = `🎉 Correct! Number was ${randomNumber}`;
        addHistory(guess, "Correct");
        updateHighScore();
        endGame();
        return;
    }

    if (attempts >= attemptLimits[currentDifficulty]) {
        message.textContent = `❌ Game Over! Number was ${randomNumber}`;
        addHistory(guess, "Game Over");
        endGame();
        return;
    }

    if (guess < randomNumber) {
        message.textContent = "📉 Too small! Try higher";
        addHistory(guess, "Too Low");
    } else {
        message.textContent = "📈 Too big! Try lower";
        addHistory(guess, "Too High");
    }

    guessInput.value = "";
    guessInput.focus();
}

// Button click
guessBtn.addEventListener("click", handleGuess);

// Enter key support 🔥
guessInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        handleGuess();
    }
});

// Restart
restartBtn.addEventListener("click", resetGame);

// History
function addHistory(value, result) {
    const li = document.createElement("li");
    li.textContent = `${value} → ${result}`;
    historyList.appendChild(li);
}

// End game
function endGame() {
    guessBtn.disabled = true;
    guessInput.disabled = true;
}

// Reset game
function resetGame() {
    attempts = 0;
    attemptsEl.textContent = 0;
    message.textContent = "Start guessing…";
    historyList.innerHTML = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessBtn.disabled = false;
    randomNumber = generateRandom(maxNumber);
    guessInput.focus();
}

// High score (per difficulty)
function getHighScoreKey() {
    return `highScore_${currentDifficulty}`;
}

function loadHighScore() {
    const score = localStorage.getItem(getHighScoreKey());
    highScoreEl.textContent = score ? score : "—";
}

function updateHighScore() {
    const key = getHighScoreKey();
    const stored = localStorage.getItem(key);

    if (!stored || attempts < stored) {
        localStorage.setItem(key, attempts);
        highScoreEl.textContent = attempts;
    }
}
