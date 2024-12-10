const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const playXBtn = document.querySelector("#playXBtn");
const playOBtn = document.querySelector("#playOBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = {
    "X": "player",
    "O": "bot"
}
let turn = "X";
let running = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    playXBtn.addEventListener("click", chooseSymbol);
    playOBtn.addEventListener("click", chooseSymbol);
    statusText.textContent = `${currentPlayer[turn]}'s turn`;
    running = true;
    if (currentPlayer[turn] === "bot") {
        botMove(options);
    }
}

function chooseSymbol() {
    if (event.target === playXBtn) {
        currentPlayer.X = "player";
        currentPlayer.O = "bot";
        restartGame();
    } else {
        currentPlayer.O = "player";
        currentPlayer.X = "bot";
        restartGame();
    }
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running || currentPlayer[turn] == "bot") {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = turn;
    cell.textContent = turn;
}

function changePlayer() { 
    turn = (turn == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer[turn]}'s turn`;

    if (currentPlayer[turn] === "bot") {
        botMove(options);
    }
}

function botMove() {
    const move = botBrain(options); 
    updateCell(cells[move], move);  
    checkWinner();
}

// Return desired move index
// currentPlayer is an object (dictionary) that stores the role of each player ('X' and 'O').
// The keys are 'X' and 'O', and the values represent whether each player is a "player" or a "bot".
// board is the current game state

function botBrain(board) {
    while (true) {
        move = Math.floor(Math.random() * 9);
        if (board[move] == "") {
            break;
        }
    }
    return move;
}

function roundWon() {
    for(let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            return true;
        }
    }
    return false;
}

function checkWinner() {
    if(roundWon()){ 
        statusText.textContent = `${currentPlayer[turn]} wins!`;
        running = false;
    } else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    turn = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer[turn]}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;

    if (currentPlayer[turn] === "bot") {
        botMove(options);
    }
}