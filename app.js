/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = () => {
  // iterate through the value of HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    // add an empty array to board with each iteration
    board.push(Array.from({ length: WIDTH }));
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
  // sets board to the HTML Element with id of board
  const board = document.getElementById('board');

  // create a row to be at the top of the game board
  const top = document.createElement('tr');
  // give it an id of column-top
  top.setAttribute('id', 'column-top');
  // listen for a click on the row
  top.addEventListener('click', handleClick);

  // iterate over the value of WIDTH to create that number of cells
  for (let x = 0; x < WIDTH; x++) {
    // create a td representing a cell
    const headCell = document.createElement('td');
    // give it an id of the current index
    headCell.setAttribute('id', x);
    // add the cell to the top row
    top.append(headCell);
  }
  // add the #column-top row to the game
  board.append(top);

  
  // iterate over the height of the board and create a row for each iteration
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    // iterate over the width and append a cell to each row for each iteration
    for (let x = 0; x < WIDTH; x++) {
      // create a td representing a cell
      const cell = document.createElement('td');
      // assign each cell an id of its x and y coordinates
      cell.setAttribute('id', `${y}-${x}`);
      //append each cell to the row
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // start at the bottom row, going up one each iteration
  for (let y = HEIGHT - 1; y >= 0; y--) {
    // check if the corresponding coordinates are false (empty)
    if (!board[y][x]) {
      // if false return the y coordinate
      return y;
    }
  }
  // if none are empty return null
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // create the piece as a div
  const piece = document.createElement('div');
  // add classes
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add('fall');
  // finds the open spot
  const spot = document.getElementById(`${y}-${x}`);
  // sends the piece to that spot
  spot.append(piece);
}


/** endGame: announce game end */

// alerts winner after 300ms to let the last piece fall
const endGame = (msg) => {
  setTimeout(() => {
    // if the alert message is dismissed, reload the page
    alert(msg) ? "" : location.reload();
  }, 300);
}

// adds an underline under the curretn player
const playerTurn = () => {
  // player text elements
  const player1 = document.getElementById('player1');
  const player2 = document.getElementById('player2');
  // if the current player is player 1
  if (currPlayer === 1) {
    // add the underline to player 1 and remove it from player 2
    player1.classList.add('underline');
    player2.classList.remove('underline');
  }
  // this is player 2 since there are only 2 players
  else {
    // add the underline to player 2 and remove it from player 1
    player2.classList.add('underline');
    player1.classList.remove('underline');
  }
}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);
  
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} wins!`);
  }
  
  // check for tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('It\'s a Tie!');
  }
    
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;

  // highlight the current player
  playerTurn();
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // iterate over the rows
  for (let y = 0; y < HEIGHT; y++) {
    // iterate over the columns
    for (let x = 0; x < WIDTH; x++) {
      // if there are 4 consecutive pieces on the x axis it's a win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // same for the y axis
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // add 1 to x and y each time to go up diagonally
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // subtract 1 from x and y each time to go down diagonally
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if ANY of them are true return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// initialize the game
playerTurn();
makeBoard();
makeHtmlBoard();

