const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
const rows = 20;
const columns = 20;

canvas.width = columns * unit;
canvas.height = rows * unit;

let snake = [{ x: unit * 5, y: unit * 5 }];
let direction = "RIGHT";
let food = getRandomFoodPosition();
let score = 0;
let isPaused = false;
let isGameOver = false;

document.addEventListener("keydown", changeDirection);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("continueButton").addEventListener("click", continueGame);
document.getElementById("restartButton").addEventListener("click", restartGame);

function gameLoop() {
    if (isGameOver) return;

    if (!isPaused) {
        setTimeout(function () {
            clearCanvas();
            drawFood();
            moveSnake();
            drawSnake();
            gameLoop();
        }, 100);
    } else {
        setTimeout(gameLoop, 100);
    }
}

function clearCanvas() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "#00FF00";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unit, unit);
    });
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === "LEFT") head.x -= unit;
    if (direction === "UP") head.y -= unit;
    if (direction === "RIGHT") head.x += unit;
    if (direction === "DOWN") head.y += unit;

    // Wrap snake position horizontally on edge of canvas
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - unit;

    // Wrap snake position vertically on edge of canvas
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - unit;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = score;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }

    if (hasGameEnded()) {
        isGameOver = true;
        document.getElementById("restartButton").style.display = "block";
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction !== "RIGHT") {
        direction = "LEFT";
    }
    if (keyPressed === 38 && direction !== "DOWN") {
        direction = "UP";
    }
    if (keyPressed === 39 && direction !== "LEFT") {
        direction = "RIGHT";
    }
    if (keyPressed === 40 && direction !== "UP") {
        direction = "DOWN";
    }
}

function pauseGame() {
    isPaused = true;
}

function continueGame() {
    if (!isGameOver) {
        isPaused = false;
    }
}

function restartGame() {
    snake = [{ x: unit * 5, y: unit * 5 }];
    direction = "RIGHT";
    food = getRandomFoodPosition();
    score = 0;
    document.getElementById("score").innerText = score;
    isPaused = false;
    isGameOver = false;
    document.getElementById("restartButton").style.display = "none";
    gameLoop();
}

function getRandomFoodPosition() {
    let x = Math.floor(Math.random() * columns) * unit;
    let y = Math.floor(Math.random() * rows) * unit;
    return { x, y };
}

function drawFood() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, unit, unit);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
}

gameLoop();