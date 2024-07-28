document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");

  // Function to solve the Sudoku puzzle
  function solveSudoku(board) {
      const solvedPuzzle = JSON.parse(JSON.stringify(board));
      solveHelper(solvedPuzzle);
      return solvedPuzzle;
  }

  // Helper function for solving Sudoku recursively
  function solveHelper(board) {
      const emptyCell = findEmptyCell(board);
      if (!emptyCell) {
          return true; // Puzzle solved
      }

      const [row, col] = emptyCell;
      for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
              board[row][col] = num;
              if (solveHelper(board)) {
                  return true;
              }
              board[row][col] = 0; // Backtrack
          }
      }
      return false; // No valid number found for this cell
  }

  // Function to find an empty cell in the Sudoku puzzle
  function findEmptyCell(board) {
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              if (board[row][col] === 0) {
                  return [row, col];
              }
          }
      }
      return null; // No empty cell found
  }

  // Function to check if a move is valid
  function isValidMove(board, row, col, num) {
      // Check row
      for (let i = 0; i < 9; i++) {
          if (board[row][i] === num) {
              return false;
          }
      }
      // Check column
      for (let i = 0; i < 9; i++) {
          if (board[i][col] === num) {
              return false;
          }
      }
      // Check 3x3 grid
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
          for (let j = startCol; j < startCol + 3; j++) {
              if (board[i][j] === num) {
                  return false;
              }
          }
      }
      return true; // Move is valid
  }

  // Function to create the Sudoku puzzle grid
  function createSudokuGrid(puzzle) {
      container.innerHTML = '';
      puzzle.forEach((row, rowIndex) => {
          const rowElement = document.createElement('div');
          rowElement.classList.add('row');
          row.forEach((cell, columnIndex) => {
              const cellElement = document.createElement('input');
              cellElement.classList.add('cell');
              cellElement.classList.add((rowIndex + columnIndex) % 2 === 0 ? 'lightBackground' : 'darkBackground');
              cellElement.type = 'text';
              cellElement.maxLength = 1;
              cellElement.value = cell !== 0 ? cell : '';
              rowElement.appendChild(cellElement);
          });
          container.appendChild(rowElement);
      });
  }

  // Function to get the current puzzle from the input fields
  function getCurrentPuzzle() {
      const puzzle = [];
      const rows = container.querySelectorAll('.row');
      rows.forEach(row => {
          const cells = row.querySelectorAll('.cell');
          const rowValues = Array.from(cells).map(cell => {
              const value = parseInt(cell.value);
              return isNaN(value) ? 0 : value;
          });
          puzzle.push(rowValues);
      });
      return puzzle;
  }

  // Function to validate the current puzzle inputs
  function validatePuzzle(puzzle) {
      for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
              const num = puzzle[row][col];
              if (num !== 0) {
                  puzzle[row][col] = 0;
                  if (!isValidMove(puzzle, row, col, num)) {
                      puzzle[row][col] = num;
                      return false;
                  }
                  puzzle[row][col] = num;
              }
          }
      }
      return true;
  }

  // Function to solve the puzzle
  function solvePuzzle() {
      const currentPuzzle = getCurrentPuzzle();
      if (!validatePuzzle(currentPuzzle)) {
          alert("Invalid inputs! Please correct the puzzle.");
          return;
      }
      const solvedPuzzle = solveSudoku(currentPuzzle);
      createSudokuGrid(solvedPuzzle);
  }

  // Function to reset the puzzle
  function resetPuzzle() {
      const emptyPuzzle = Array(9).fill(0).map(() => Array(9).fill(0));
      createSudokuGrid(emptyPuzzle);
  }

  // Initial puzzle creation (empty)
  resetPuzzle();

  // Attach event listeners to buttons
  document.getElementById("solveButton").addEventListener("click", solvePuzzle);
  document.getElementById("resetButton").addEventListener("click", resetPuzzle);
});
