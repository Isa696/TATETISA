document.addEventListener('DOMContentLoaded', () => {
  const gameModeCheckbox = document.querySelector('.checkbox-wrapper-25 input');
  const gameModeButton = document.getElementById('game-mode');

  const board = document.getElementById('board');
  const status = document.getElementById('status');
  const cells = [];

  let currentPlayer = 'X';
  let winner = null;
  let singlePlayerMode = false;

  function startSinglePlayerGame() {
    singlePlayerMode = true;
    resetGame();
  }

  function resetGame() {
    currentPlayer = 'X';
    winner = null;

    // Limpiar el tablero y reiniciar las celdas
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('cell-winner');
    });

    status.textContent = singlePlayerMode ? 'Tu turno "X"' : 'Turno "X"';

    // Si es el modo de un solo jugador y es el turno de la CPU, que realice su movimiento
    if (singlePlayerMode && currentPlayer === 'O') {
      makeCPUMove();
    }
  }

  function handleCellClick(event) {
    const clickedCell = event.target;
    const index = clickedCell.dataset.index;

    // Check if the cell is already taken or if there is a winner
    if (!cells[index].textContent && !winner) {
      cells[index].textContent = currentPlayer;

      // Check for a winner after each move
      if (checkWinner()) {
        status.textContent = `Jugador ${winner} Gana!`;
      } else if (isBoardFull()) {
        status.textContent = "Es Empate!";
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = singlePlayerMode ? `Turno "${currentPlayer}"` : `Turno "${currentPlayer}"`;

        if (singlePlayerMode && currentPlayer === 'O') {
          // Es el turno de la CPU en el modo de un solo jugador
          setTimeout(() => {
            makeCPUMove();
          }, 1000);
        }
      }
    }
  }

  function makeCPUMove() {
    // Filtra las celdas disponibles
    const availableCells = cells.filter(cell => !cell.textContent);

    if (availableCells.length > 0) {
      // Elige una celda aleatoria para la CPU
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const selectedCell = availableCells[randomIndex];

      // Simula el clic en la celda seleccionada por la CPU
      selectedCell.click();
    }
  }

  function checkWinner() {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
        winner = cells[a].textContent;
        highlightWinnerCells(combo);
        return true;
      }
    }

    return false;
  }

  function isBoardFull() {
    return cells.every(cell => cell.textContent);
  }

  function highlightWinnerCells(cellsToHighlight) {
    cellsToHighlight.forEach(index => {
      cells[index].classList.add('cell-winner');
    });
  }

  // Inicializar el tablero de juego
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
    cells.push(cell);
  }

  // Agregar evento de cambio al checkbox
  gameModeCheckbox.addEventListener('change', function () {
    singlePlayerMode = this.checked;
    resetGame();
  });

  // Agregar evento de clic al botón de reinicio
  const btnReset = document.querySelector('.btn-reset');
  btnReset.addEventListener('click', resetGame);

  // Agregar evento de clic al botón de modo de juego
  gameModeButton.addEventListener('click', startSinglePlayerGame);
});
