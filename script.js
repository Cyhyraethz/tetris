document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  const lTetromino = [
    [0, 1, width, width * 2],
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2, width * 2 + 1],
    [0, width, width + 1, width + 2],
  ];
  let row = 0;
  lTetromino.forEach((shape) => {
    shape.forEach((square) => {
      squares[square + row].style.backgroundColor = 'black';
    });
    row += 40;
  });
});
