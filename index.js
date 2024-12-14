const cells = document.querySelectorAll(".cell");
const moveText = document.querySelector("#moveTime")
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
    statusText.textContent = `${currentPlayer[turn]}'s turn`;

    if (currentPlayer[turn] === "bot") {
        botMove(options);
    }
}

function botMove() {
    const startTime = performance.now();
    let reversePlayer = reverseDictionary(currentPlayer);
    let bestScore = -10;
    let board = options;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            board[i] = reversePlayer["bot"];
            let score = botBrain(board, false, -Infinity, Infinity);
            console.log(`score of ${i} is ${score}`);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    const endTime = performance.now();
    const elapsedTime = (endTime - startTime).toFixed(2); // Time in milliseconds, rounded to two decimal places

    moveText.textContent = `Move time: ${elapsedTime} ms`;
    
    updateCell(cells[bestMove], bestMove);  
    checkWinner();
}

// Return desired move index
// currentPlayer is an object (dictionary) that stores the role of each player ('X' and 'O').
// The keys are 'X' and 'O', and the values represent whether each player is a "player" or a "bot".
// board is the current game state

function botBrain(board, isMaximizing, alpha, beta) {
    let reversePlayer = reverseDictionary(currentPlayer);
    let testscore;
    switch (roundWon(board)) {
        case reversePlayer["bot"]:
            return 1;
            break;
        case reversePlayer["player"]:
            return -1;
        case "draw":
            return 0;
    }
    let bestScore = (isMaximizing) ? -Infinity : Infinity;

    if (isMaximizing) {
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = reversePlayer["bot"];
                testscore = botBrain(board, false, alpha, beta);
                board[i] = "";
                bestScore = Math.max(bestScore, testscore);
                alpha = Math.max(alpha, testscore);
                if (beta <= alpha) {
                    break;
                }
            }
        }
    } else {
        for (let i = 0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = reversePlayer["player"];
                testscore = botBrain(board, true, alpha, beta);
                board[i] = "";
                bestScore = Math.min(bestScore, testscore);
                beta = Math.min(beta, testscore);
                if (beta <= alpha) {
                    break;
                }
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