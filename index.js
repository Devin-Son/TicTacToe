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

    if (options[cellIndex] != "" || !running || currentPlayer[turn] == "bot") {
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
    console.log(`turn is ${turn}`);
    statusText.textContent = `${currentPlayer[turn]}'s turn`;

    if (currentPlayer[turn] === "bot") {
        botMove(options);
    }
}

function botMove() {
    let reversePlayer = reverseDictionary(currentPlayer);
    let bestScore = -10;
    let board = options;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            board[i] = reversePlayer["bot"];
            let score = botBrain(board, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    updateCell(cells[bestMove], bestMove);  
    checkWinner();
}

// Return desired move index
// currentPlayer is an object (dictionary) that stores the role of each player ('X' and 'O').
// The keys are 'X' and 'O', and the values represent whether each player is a "player" or a "bot".
// board is the current game state

function botBrain(board, isMaximizing) {
    let reversePlayer = reverseDictionary(currentPlayer);
    score = (isMaximizing) ? 1 : -1;
    switch (roundWon(board)) {
        case reversePlayer["bot"]:
            // console.log(`bot wins in case ${board}`);
            return 1;
            break;
        case reversePlayer["player"]:
            // console.log(`player wins in case ${board}`);
            return -1;
        case "draw":
            return 0;
    }
    let bestScore = -10 * score;
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            board[i] = (isMaximizing) ? reversePlayer["bot"] : reversePlayer["player"];
            let testscore = botBrain(board, !isMaximizing);
            board[i] = "";
            if (isMaximizing) {
                bestScore = Math.max(bestScore, testscore);
            } else {
                bestScore = Math.min(bestScore, testscore);
            }
        }
    }
    return bestScore;
}

function roundWon(board) {
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = board[condition[0]];
        const cellB = board[condition[1]];
        const cellC = board[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            return cellA;
        }
    }

    if (!board.includes("")) {
        return 'draw';
    }

    return false;
}

function checkWinner() {
    if (roundWon(options) == 'draw') {
        console.log(`draw`);
        statusText.textContent = `Draw!`;
        running = false;
    } else if (roundWon(options)) { 
        statusText.textContent = `${currentPlayer[turn]} wins!`;
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

function reverseDictionary(obj) {
    return Object.entries(obj).reduce((reversed, [key, value]) => {
        reversed[value] = reversed[value] ? [].concat(reversed[value], key) : key;
        return reversed;
    }, {});
}