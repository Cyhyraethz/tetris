document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const mini = document.querySelector('.mini-grid');
  for (let i = 0; i < 210; i++) {
    let square = document.createElement('div');
    square.classList.add('border');
    if (i > 199) {
      square.classList.add('taken');
      square.classList.remove('border');
    }
    grid.appendChild(square);
  }
  for (let i = 0; i < 16; i++) {
    let square = document.createElement('div');
    mini.appendChild(square);
  }
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const levelDisplay = document.querySelector('#level');
  const startBtn = document.querySelector('#start-button');
  const restartBtn = document.querySelector('#restart-button');
  const resetBtn = document.querySelector('#reset-button');
  const width = 10;
  let level = 1;
  let score = 0;
  let speed = 0;
  let timerId = 0;
  let nextRandom = 0;
  const colors = [
    'orange',
    'blue',
    'red',
    'green',
    'purple',
    'yellow',
    'indigo',
  ];
  const lTetromino = [
    [1, 2, width + 2, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width + 2, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const jTetromino = [
    [1, 2, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const zTetromino = [
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
  ];
  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const theTetrominoes = [
    lTetromino,
    jTetromino,
    zTetromino,
    sTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentPosition = 4;
  let currentRotation = 0;
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      while (
        !current.some((index) =>
          squares[currentPosition + index + width * 2].classList.contains(
            'taken'
          )
        )
      ) {
        moveDown();
      }
      if (!gameOver()) {
        moveDown();
      }
    }
  }
  document.addEventListener('keyup', control);
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add('taken')
      );
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      displayShape();
      addScore();
      gameOver();
      draw();
    }
  }
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index - 9) % width === 0
    );
    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }
  function rotate() {
    let nextRotation = currentRotation + 1;
    if (nextRotation === current.length) {
      nextRotation = 0;
    }
    if (
      theTetrominoes[random][nextRotation].some(
        (index) => (currentPosition + index) % width === 0
      )
    ) {
      moveRight();
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      while (
        !current.some((index) => (currentPosition + index) % width === 0)
      ) {
        moveLeft();
      }
      draw();
    } else if (
      theTetrominoes[random][nextRotation].some(
        (index) => (currentPosition + index - 9) % width === 0
      )
    ) {
      // bug: tetromino seems to not moving left here
      moveLeft();
      // bug: tetromino seems to not moving left here
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      while (
        !current.some((index) => (currentPosition + index - 9) % width === 0)
      ) {
        moveRight();
      }
      draw();
    } else {
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      draw();
    }
  }
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  const displayIndex = 0;
  const upNextTetrominoes = [
    [1, 2, displayWidth + 2, displayWidth * 2 + 2], // lTetromino
    [1, 2, displayWidth + 1, displayWidth * 2 + 1], // jTetromino
    [1, displayWidth, displayWidth + 1, displayWidth * 2], // zTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // sTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
  ];
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add('tetromino');
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000 - speed);
      if (!nextRandom) {
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      }
      displayShape();
    }
  });
  restartBtn.addEventListener('click', () => {
    restart();
  });
  resetBtn.addEventListener('click', () => {
    reset();
  });
  function levelUp() {
    if (speed < 900) {
      speed += 100;
      level++;
      levelDisplay.innerHTML = level;
    }
    clearInterval(timerId);
    timerId = setInterval(moveDown, 1000 - speed);
  }
  function increaseScore() {
    score += 10;
    scoreDisplay.innerHTML = score;
  }
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains('taken'))) {
        increaseScore();
        if (score % 100 === 0) {
          levelUp();
        }
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId);
      return true;
    } else {
      return false;
    }
  }
  function restart() {
    level = 1;
    score = 0;
    speed = 0;
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    for (let i = 0; i < 200; i++) {
      squares[i].classList.remove('taken');
      squares[i].classList.remove('tetromino');
      squares[i].style.backgroundColor = '';
    }
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    clearInterval(timerId);
    timerId = setInterval(moveDown, 1000 - speed);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    draw();
    displayShape();
  }
  function reset() {
    level = 1;
    score = 0;
    speed = 0;
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    for (let i = 0; i < 200; i++) {
      squares[i].classList.remove('taken');
      squares[i].classList.remove('tetromino');
      squares[i].style.backgroundColor = '';
    }
    displaySquares.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    clearInterval(timerId);
    timerId = null;
    nextRandom = null;
  }
});
// bug: problem with rotate function when tetromino is at right wall
// bug: tetrominoes can still be moved and rotated while game is paused
// bug: tetrominoes can still be moved and rotated before game has been started
// to do: make holding down right or left move tetromino that direction repeatedly
