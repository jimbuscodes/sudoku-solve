/* 
    Sudoku solving script:
        - created with the assistance of Claude Sonnet 4
*/

// input collection functions
function getInputsAs2DArray() {
  const rows = document.querySelectorAll(".row");
  const grid = [];

  rows.forEach((row) => {
    const rowInputs = row.querySelectorAll('input[type="text"]');
    const rowValues = Array.from(rowInputs).map(
      (input) => parseInt(input.value) || 0
    );
    grid.push(rowValues);
  });

  return grid;
}

function setInputValues(sudokuArray) {
  const rows = document.querySelectorAll(".row");
  rows.forEach((row, rowIndex) => {
    const inputs = row.querySelectorAll('input[type="text"]');
    inputs.forEach((input, colIndex) => {
      if (sudokuArray[rowIndex][colIndex] !== 0) {
        input.value = sudokuArray[rowIndex][colIndex];
      }
    });
  });
}

// sudoku Validation Functions
function isValidMove(grid, row, col, num) {
  // check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
}

function isValidSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] !== 0) {
        const num = grid[row][col];
        grid[row][col] = 0; // temporarily remove to check
        if (!isValidMove(grid, row, col, num)) {
          grid[row][col] = num; // restore
          return false;
        }
        grid[row][col] = num; // restore
      }
    }
  }
  return true;
}

// sudoku solver
function solveSudoku(grid) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) {
              return true;
            }

            grid[row][col] = 0; // backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}

// helper functions
function copyGrid(grid) {
  return grid.map((row) => [...row]);
}

function clearGrid() {
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => (input.value = ""));
}

function generateRandomPuzzle() {
  // start with empty grid
  const grid = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  // fill diagonal 3x3 boxes first (they don't interfere with each other)
  for (let box = 0; box < 3; box++) {
    fillBox(grid, box * 3, box * 3);
  }

  // solve the rest
  solveSudoku(grid);

  // remove random numbers to create puzzle
  const cellsToRemove = 40 + Math.floor(Math.random() * 20); // Remove 40-60 cells
  for (let i = 0; i < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    grid[row][col] = 0;
  }

  return grid;
}

function fillBox(grid, row, col) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // shuffle array
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  let index = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = nums[index++];
    }
  }
}

//  main solver function
function solve() {
  const grid = getInputsAs2DArray();

  // validate current state
  if (!isValidSudoku(grid)) {
    alert("Invalid Sudoku puzzle! Please check your input.");
    return;
  }

  // create a copy to solve
  const puzzleToSolve = copyGrid(grid);

  // attempt to solve
  if (solveSudoku(puzzleToSolve)) {
    setInputValues(puzzleToSolve);
    alert("Solved Sudoku puzzle sucessfully!");
  } else {
    alert("This Sudoku puzzle cannot be solved!");
  }
}

// additional utility functions
function validateInput() {
  const grid = getInputsAs2DArray();
  if (isValidSudoku(grid)) {
    alert("Current puzzle is valid!");
  } else {
    alert("Current puzzle has errors!");
  }
}

function loadRandomPuzzle() {
  const puzzle = generateRandomPuzzle();
  setInputValues(puzzle);
}

// called when page loads
function setupSudokuSolver() {
  // add action listners to buttons

  const solveBtn = document.getElementById("solveBtn");
  solveBtn.onclick = solve;

  const clearBtn = document.getElementById("clearBtn");
  clearBtn.onclick = clearGrid;

  const validateBtn = document.getElementById("validateBtn");
  validateBtn.onclick = validateInput;

  const randomBtn = document.getElementById("randomBtn");
  randomBtn.onclick = loadRandomPuzzle;

  // add input validation to prevent invalid characters
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      // Only allow numbers 1-9
      this.value = this.value.replace(/[^1-9]/g, "");
      if (this.value.length > 1) {
        this.value = this.value.slice(-1);
      }
    });
  });
}

// initialize when page loads
document.addEventListener("DOMContentLoaded", setupSudokuSolver);
