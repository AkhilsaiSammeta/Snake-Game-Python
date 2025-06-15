document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const scoreDisplay = document.getElementById("score");
  const gameOverText = document.getElementById("gameOverText");
  const speedSelect = document.getElementById("speedSelect");

  const boardSize = 30;
  let snake = [{ x: 15, y: 15 }];
  let direction = { x: 0, y: 0 };
  let food = {};
  let score = 0;
  let gameInterval;

  function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < boardSize * boardSize; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      board.appendChild(cell);
    }
  }

  function getIndex(x, y) {
    return y * boardSize + x;
  }

  function draw() {
    const cells = document.getElementsByClassName("cell");
    Array.from(cells).forEach(cell => {
      cell.classList.remove("snake", "food");
    });

    snake.forEach(part => {
      if (part.x >= 0 && part.y >= 0 && part.x < boardSize && part.y < boardSize)
        cells[getIndex(part.x, part.y)].classList.add("snake");
    });

    cells[getIndex(food.x, food.y)].classList.add("food");
  }

  function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (
      head.x < 0 || head.x >= boardSize ||
      head.y < 0 || head.y >= boardSize ||
      snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreDisplay.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function placeFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize)
      };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y));
    food = newFood;
  }

  function gameOver() {
    clearInterval(gameInterval);
    gameOverText.classList.remove("d-none");
  }

  function startGame() {
    clearInterval(gameInterval);
    direction = { x: 1, y: 0 };
    const speed = parseInt(speedSelect.value) || 120;
    gameInterval = setInterval(moveSnake, speed);
  }

  function resetGame() {
    clearInterval(gameInterval);
    snake = [{ x: 15, y: 15 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreDisplay.textContent = score;
    gameOverText.classList.add("d-none");
    createBoard();
    placeFood();
    draw();
  }

  document.addEventListener("keydown", e => {
    switch (e.key) {
      case "ArrowUp": if (direction.y === 0) direction = { x: 0, y: -1 }; break;
      case "ArrowDown": if (direction.y === 0) direction = { x: 0, y: 1 }; break;
      case "ArrowLeft": if (direction.x === 0) direction = { x: -1, y: 0 }; break;
      case "ArrowRight": if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
  });

  // Init
  createBoard();
  placeFood();
  draw();

  // Expose functions to HTML
  window.startGame = startGame;
  window.resetGame = resetGame;
});
