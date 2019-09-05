const displayBoard = document.querySelector("#displayBoard");
const cases = document.querySelectorAll(".uneCase");
const turnDisplayer = document.querySelector("#turnDisplayer");
const clearButton = document.querySelector("#clearGame");
const play1Name = document.querySelector("#player1Name");
const play2Name = document.querySelector("#player2Name");
const startGame = document.querySelector("#startGame");
const playerDiv = document.querySelector("#players");
const changePlayers = document.querySelector("#newGame");
const botSelect = document.querySelector("#botSelect");


const gameBoard = (() => {
    const board = [0,0,0,0,0,0,0,0,0];
    const write = (caseNumber,number) => {board[caseNumber] = number;}
    const show = () => {
        console.log(board[0] + "|" + board[1] + "|" + board[2]);
        console.log(board[3] + "|" + board[4] + "|" + board[5]);
        console.log(board[6] + "|" + board[7] + "|" + board[8]);
    }
    const render = () => {
        
        for (let i =0; i<9; i++){
            if (board[i] === 1){
                cases[i].style.backgroundImage = "url('img/cross.png')";
                cases[i].style.backgroundSize = "150px";
            }
            else if (board[i] === 2){
                cases[i].style.backgroundImage = "url('img/circle.png')";
            }
            else {
                cases[i].style.backgroundImage = "none";
                cases[i].style.backgroundSize = "200px";
            }
        }
    }
    const giveCase = (number) => {
        let result = board[number];
        return result;
    }
    const clear = () => {
        for (let i=0;i<9;i++){
            write(i,0);
        }
        render();
        gameController.resetTurn();

    }
    let copy = () => {
        let boardCopy = [];
        for (let i = 0; i<9 ; i++){
            boardCopy[i]=board[i];
        }
        return boardCopy;
    }

    return {write, show, render, giveCase, clear, copy};
})();

const player = (name, number, bot) => {
    let playerName = name;
    let playerBot = bot;
    let playerNumber = number;
    const getName = () => playerName;
    
    const changeName = (newName) => {
        playerName = newName;
        gameController.turnDisplay();
    }
    const isBot = () => playerBot;

    const makeBot = (test) => {
        if (test){
        playerBot = true;
        }
        else {
            playerBot = false;
        }
    }

    const play = (caseNumber) => {
        if (gameBoard.giveCase(caseNumber)===0){
            gameBoard.write(caseNumber,number);
            gameBoard.render();
            return true;
        }
        else {return false;}
    }
    const getNumber = () => playerNumber;

    return {getName, play, changeName, isBot, makeBot, getNumber};
};

const player1 = player("Player 1", 1, false);
const player2 = player("Player 2", 2, false);

const gameController =((player1, player2) => {
    let turn = player1;
    let turnNumber = 1;
    
    const turnChange = () => {
        if (turn === player1){turn = player2;}
        else {turn = player1;}
        turnDisplay();
        turnNumber++;
    }

    const playerTurn = () => turn;

    const turnDisplay = () => {
        turnDisplayer.textContent = turn.getName() + "'s turn";
    }

    const winTest = (board, player) => {
        let result = false;
        const rowTest = (number) => {
            if ((board[number]===player)&&(board[number+1]===player)&&(board[number+2]===player)){
                result = true;
            }
        }
        const colTest = (number) => {
            if ((board[number]===player)&&(board[number+3]===player)&&(board[number+6]===player)){
                if (board[number] !== 0 ){
                    result = true;
                }
            }
        }
        const diagTest = () => {
            if(((board[0]===player)&&(board[4]===player)&&(board[8]===player)) || ((board[2]===player)&&(board[4]===player)&&(board[6]===player))){
                if (board[4] !== 0 ){
                    result = true;
                }
            }
        }
        rowTest(0);
        rowTest(3);
        rowTest(6);
        colTest(0);
        colTest(1);
        colTest(2);
        diagTest();
        
        return result;
    }

    const newGame = () => {
        turn = player1;
        gameBoard.clear();
        turnDisplay();
    }
     

    const computerPlay = () => {
        const minimax = (board, player) => {
            let opponent = 1;
            if (player === 1){opponent =2;}
            if (winTest(board, player)){
                return 1;
            }
            else if (winTest(board, opponent)){
                return -1;
            }
            let move =-1;
            let score = -2;
            for (let i =0; i<9; i++){
                if (board[i]===0){
                    let boardWithNewMove = [];
                    for (let i=0;i<9;i++){
                        boardWithNewMove[i]=board[i];
                    }
                    boardWithNewMove[i]=player;
                    let scoreForTheMove = -1*minimax(boardWithNewMove,opponent);
                    if (scoreForTheMove>score){
                        score = scoreForTheMove;
                        move=i;
                    }
                }
            }
            if (move === -1){
                return 0;
            }
            return score;
        }

        let possiblePlay = [];
        for (let i = 0 ; i<9 ; i++){
            if (gameBoard.giveCase(i)===0){possiblePlay.push(i);}
        }
        let minmaxScore = 2;
        let shouldPlay = 0;
        for (let i = 0; i < possiblePlay.length; i++){
            let newBoard = gameBoard.copy();
            newBoard[possiblePlay[i]]=2;
            let moveScore = minimax(newBoard,1);
            if (moveScore < minmaxScore){
                minmaxScore = moveScore;
                shouldPlay = i;
            }
        }
        playerTurn().play(possiblePlay[shouldPlay]);
        if (winTest(gameBoard.copy(),playerTurn().getNumber())){
            alert(playerTurn().getName() + " has won")
            gameBoard.clear();
            turn = player1;
            turnDisplay();
        }
        else if (turnNumber === 9){
            alert("it's a draw!");
            gameBoard.clear();
            turn = player1;
            turnDisplay();
        }
        else{
            turnChange();
        }
    }

    const turnPlay = (e) => {
        const div = e.target;
        let casesArray = Array.from(cases);
        let index = casesArray.indexOf(div);
        let validMove = playerTurn().play(index);
        if (winTest(gameBoard.copy(),playerTurn().getNumber())){
            alert(playerTurn().getName() + " has won")
            gameBoard.clear();
            turn = player1;
            turnDisplay();
        }
        else if (turnNumber === 9){
            alert("it's a draw!");
            gameBoard.clear();
        }
        else{
            if (validMove){
                turnChange();
                if (playerTurn().isBot()){
                    computerPlay();
                }
            }
            
        }
    }

    const initialize = () => {
        player1.changeName(play1Name.value);
        player2.changeName(play2Name.value);
        if (botSelect.value === "true"){
            player2.makeBot(true);
        }
        else {
            player2.makeBot(false);
        }
        turn = player1;
        playerDiv.style.display = "none";
        play1Name.value = "player 1";
        play2Name.value = "player 2";

        turnDisplay();
        cases.forEach((div) => {
            div.addEventListener("click", turnPlay)
        })

    }
    const stopGame = () => {
        playerDiv.style.display = "inline-block";
        gameBoard.clear();
        cases.forEach((div) => {
            div.removeEventListener("click", turnPlay)
        })
        turnDisplayer.textContent="";

    }
    const resetTurn = () => {
        turnNumber = 1;
    }

    return {turnDisplay, newGame, initialize, stopGame, resetTurn}
})(player1, player2);

startGame.addEventListener("click", gameController.initialize)
changePlayers.addEventListener("click", gameController.stopGame)
clearButton.addEventListener("click",gameController.newGame)