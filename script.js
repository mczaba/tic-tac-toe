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
    const show = () => { //show the board in the console
        console.log(board[0] + "|" + board[1] + "|" + board[2]);
        console.log(board[3] + "|" + board[4] + "|" + board[5]);
        console.log(board[6] + "|" + board[7] + "|" + board[8]);
    }
    const render = () => { //render the board
        
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
    const giveCase = (number) => {//gives the number inside the asked case
        let result = board[number];
        return result;
    }
    const clear = () => { //clear the board and reset the game
        for (let i=0;i<9;i++){
            write(i,0);
        }
        render();
        gameController.resetTurn();

    }
    let copy = () => { //make a copy of the board
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
    let playerBot = bot; //true if the player is a bot
    let playerNumber = number; //what number corresponds to the player in the board array
    const getName = () => playerName;
    
    const changeName = (newName) => {
        playerName = newName;
        gameController.turnDisplay();
    }
    const isBot = () => playerBot;

    const makeBot = (test) => { //make the player a bot
        if (test){
        playerBot = true;
        }
        else {
            playerBot = false;
        }
    }

    const play = (caseNumber) => { 
        //plays in the case with index caseNumber and returns true if the move was valid or false otherwise
        if (gameBoard.giveCase(caseNumber)===0){
            //check if the case is empty, and plays the case if it is
            gameBoard.write(caseNumber,number);
            gameBoard.render();
            return true;
        }
        else {//if case wasn't empty does nothing and returns false
            return false;
        }
    }
    const getNumber = () => playerNumber; 

    return {getName, play, changeName, isBot, makeBot, getNumber};
};

const player1 = player("Player 1", 1, false);
const player2 = player("Player 2", 2, false);

const gameController =((player1, player2) => {
    let turn = player1;
    let turnNumber = 1; //at turn 9 declare a draw if no winner was detecter
    
    const turnChange = () => { //change whose player turn is it
        if (turn === player1){turn = player2;}
        else {turn = player1;}
        turnDisplay();
        turnNumber++;
    }

    const playerTurn = () => turn;

    const turnDisplay = () => { //display which player turn it is
        turnDisplayer.textContent = turn.getName() + "'s turn";
    }

    const winTest = (board, player) => { //check if player has won the game
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

    const newGame = () => { //reset the game
        turn = player1;
        gameBoard.clear();
        turnDisplay();
    }
     

    const computerPlay = () => { //algorithm for the computer's turn
        const minimax = (board, player) => { 
            //this function checks which case is the most advantageous to player given a board and whose turn it is
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
                if (board[i]===0){//if move is valid
                    let boardWithNewMove = []; //make a copy of the board
                    for (let i=0;i<9;i++){
                        boardWithNewMove[i]=board[i];
                    }
                    boardWithNewMove[i]=player; //plays the move
                    let scoreForTheMove = -1*minimax(boardWithNewMove,opponent); 
                    //returns the minimax of the new board from the opponent perspective. *-1 because it's the opponents perspective
                    if (scoreForTheMove>score){//look for the best play possible
                        score = scoreForTheMove;
                        move=i;
                    }
                }
            }
            if (move === -1){//if there's no winning move, return 0
                return 0;
            }
            return score;
        }

        let possiblePlay = [];//array of possible moves
        for (let i = 0 ; i<9 ; i++){
            if (gameBoard.giveCase(i)===0){possiblePlay.push(i);}
        }
        let minmaxScore = 2;
        let shouldPlay = 0; 
        for (let i = 0; i < possiblePlay.length; i++){ 
            //check all possible moves for the minimax 
            let newBoard = gameBoard.copy();
            newBoard[possiblePlay[i]]=2;
            let moveScore = minimax(newBoard,1);
            if (moveScore < minmaxScore){
                minmaxScore = moveScore;
                shouldPlay = i;
            }
        }
        playerTurn().play(possiblePlay[shouldPlay]); //plays the move with highest minimax
        if (winTest(gameBoard.copy(),playerTurn().getNumber())){
            //if computer wins display the winner and reset the game
            alert(playerTurn().getName() + " has won")
            newGame();
        }
        else if (turnNumber === 9){
            //if he didn't win and it's last turn display a draw and reset the game
            alert("it's a draw!");
            newGame();
        }
        else{
            //if he didn't win and it's not the last turn, then change turn
            turnChange();
        }
    }

    const turnPlay = (e) => {
        //turn for the player, take the click on a case event
        const div = e.target;
        //div is the case clicked
        let casesArray = Array.from(cases);
        let index = casesArray.indexOf(div);
        //makes an array from the nodelist and get the index corresponding to the div
        let validMove = playerTurn().play(index); //plays the index of the div
        if (winTest(gameBoard.copy(),playerTurn().getNumber())){
            alert(playerTurn().getName() + " has won")
            newGame();
        }
        else if (turnNumber === 9){
            alert("it's a draw!");
            newGame();
        }
        else{
            if (validMove){
                //if the move wasn't valid it does not change turn
                turnChange();
                if (playerTurn().isBot()){
                    computerPlay();
                }
            }
            
        }
    }

    const initialize = () => {
        //initialize the game with players names and make player 2 a bot if checked
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
            //makes the cases clickable to play
            div.addEventListener("click", turnPlay)
        })

    }
    const stopGame = () => {
        //stop the game, hide the turn displayer and makes cases unclickable
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