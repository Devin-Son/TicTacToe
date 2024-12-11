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
    const move = botBrain(options, true); 
    updateCell(cells[move], move);  
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
            console.log("bot has won in this scenario");
            return 1 * score;
            break;
        case reversePlayer["player"]:
            console.log("player has won in this scenario");
            return -1 * score;
        case "draw":
            return 0;
    }
    let bestScore = -10 * score;
    let bestMove;
    for (let i = 0; i < 9; i++) {
        if (board[i] == "") {
            board[i] = (isMaximizing) ? reversePlayer["bot"] : reversePlayer["player"];
            let score = botBrain(board, !isMaximizing);
            console.log(`Score at board position ${board} is ${score}`);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    console.log('finished');
    console.log(bestMove);
    return bestMove;
}

function roundWon(board) {
    for(let i = 0; i < winConditions.length; i++) {
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

    if(!board.includes("")) {
        return 'draw';
    }

    return false;
}

function checkWinner() {
    if(roundWon(options)){ 
        statusText.textContent = `${currentPlayer[turn]} wins!`;
        running = false;
    } else if(!options.includes("")) {
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

function reverseDictionary(obj) {
    return Object.entries(obj).reduce((reversed, [key, value]) => {
        reversed[value] = reversed[value] ? [].concat(reversed[value], key) : key;
        return reversed;
    }, {});
}