const displayBoard = document.querySelector("#displayBoard");
const cases = document.querySelectorAll(".uneCase");
const turnDisplayer = document.querySelector("#turnDisplayer");
const clearButton = document.querySelector("#clearGame");
const play1Name = document.querySelector("#player1Name");
const play2Name = document.querySelector("#player2Name");
const startGame = document.querySelector("#startGame");
const playerDiv = document.querySelector("#players");
const changePlayers = document.querySelector("#newGame");

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
                cases[i].textContent = "X";
            }
            else if (board[i] === 2){
                cases[i].textContent = "O";
            }
            else {
                cases[i].textContent = "";
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

    return {write, show, render, giveCase, clear};
})();

const player = (name, number) => {
    let playerName = name;
    const getName = () => playerName;
    const play = (caseNumber) => {
        if (gameBoard.giveCase(caseNumber)===0){
            gameBoard.write(caseNumber,number);
            gameBoard.render();
            return true;
        }
        else {return false;}
    }
    const changeName = (newName) => {
        playerName = newName;
        gameController.turnDisplay();
    }
    return {getName, play, changeName};
};

const player1 = player("Player 1", 1);
const player2 = player("Player 2", 2);

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
    const winTest = () => {
        let result = false;
        const rowTest = (number) => {
            if ((gameBoard.giveCase(number)===gameBoard.giveCase(number + 1 ))&&(gameBoard.giveCase(number)===gameBoard.giveCase(number +2 ))){
                if (gameBoard.giveCase(number) !== 0 ){
                    result = true;
                }
            }
        }
        const colTest = (number) => {
            if ((gameBoard.giveCase(number)===gameBoard.giveCase(number + 3 ))&&(gameBoard.giveCase(number)===gameBoard.giveCase(number +6 ))){
                if (gameBoard.giveCase(number) !== 0 ){
                    result = true;
                }
            }
        }
        const diagTest = () => {
            if(((gameBoard.giveCase(0)===gameBoard.giveCase(4))&&(gameBoard.giveCase(0)===gameBoard.giveCase(8)))
            ||((gameBoard.giveCase(2)===gameBoard.giveCase(4))&&(gameBoard.giveCase(2)===gameBoard.giveCase(6)))){
                if (gameBoard.giveCase(4) !== 0 ){
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

    const play = (e) => {
        const div = e.target;
        let casesArray = Array.from(cases);
        let index = casesArray.indexOf(div);
        let validMove = playerTurn().play(index);
        if (winTest()){
            alert(playerTurn().getName() + " has won")
            gameBoard.clear();
        }
        else if (turnNumber === 9){
            alert("it's a draw!");
            gameBoard.clear();
        }
        if (validMove){
            turnChange();
        }
    }

    const initialize = () => {
        player1.changeName(play1Name.value);
        player2.changeName(play2Name.value);
        playerDiv.style.display = "none";
        play1Name.value = "player 1";
        play2Name.value = "player 2";
        turnDisplay();
        cases.forEach((div) => {
            div.addEventListener("click", play)
        })

    }
    const stopGame = () => {
        playerDiv.style.display = "inline-block";
        gameBoard.clear();
        cases.forEach((div) => {
            div.removeEventListener("click", play)
        })
    }
    const resetTurn = () => {
        turnNumber = 1;
    }

    return {turnDisplay, newGame, initialize, stopGame, resetTurn}
})(player1, player2);

startGame.addEventListener("click", gameController.initialize)
changePlayers.addEventListener("click", gameController.stopGame)
clearButton.addEventListener("click",gameController.newGame)


