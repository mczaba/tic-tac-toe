const displayBoard = document.querySelector("#displayBoard");
const cases = document.querySelectorAll(".uneCase");
const turnDisplayer = document.querySelector("#turnDisplayer");


const gameBoard = (() => {
    const board = ["","","","","","","","",""];
    const write = (caseNumber,string) => {board[caseNumber] = string;}
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

    return {write, show, render, giveCase};
})();

const player = (name, number) => {
    const getName = () => name;
    const play = (caseNumber) => {
        gameBoard.write(caseNumber,number);
        gameBoard.render();
    }
    return {getName, play};
};

const martin = player("martin", 1);
const helene = player("helene", 2);

const gameController =((player1, player2) => {
    let turn = player1;
    const turnChange = () => {
        if (turn === player1){turn = player2;}
        else {turn = player1;}
        turnDisplay();
    }
    const playerTurn = () => turn;
    const turnDisplay = () => {
        turnDisplayer.textContent = turn.getName() + "'s turn";
    }
    const winTest = () => {
        let result = false;
        const rowTest = (number) => {
            if ((gameBoard.giveCase(number)===gameBoard.giveCase(number + 1 ))&&(gameBoard.giveCase(number)===gameBoard.giveCase(number +2 ))){
                if (gameBoard.giveCase(number) !== "" ){
                    result = true;
                }
            }
        }
        const colTest = (number) => {
            if ((gameBoard.giveCase(number)===gameBoard.giveCase(number + 3 ))&&(gameBoard.giveCase(number)===gameBoard.giveCase(number +6 ))){
                if (gameBoard.giveCase(number) !== "" ){
                    result = true;
                }
            }
        }
        const diagTest = () => {
            if(((gameBoard.giveCase(0)===gameBoard.giveCase(4))&&(gameBoard.giveCase(0)===gameBoard.giveCase(8)))
            ||((gameBoard.giveCase(2)===gameBoard.giveCase(4))&&(gameBoard.giveCase(2)===gameBoard.giveCase(6)))){
                if (gameBoard.giveCase(4) !== "" ){
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
    return {turnChange, playerTurn, turnDisplay, winTest}
})(martin, helene);



cases.forEach((div) => {
    div.addEventListener("click", () => {
        let casesArray = Array.from(cases);
        let index = casesArray.indexOf(div);
        gameController.playerTurn().play(index);
        if (gameController.winTest()){
            alert(gameController.playerTurn().getName() + " has won")
        }
        gameController.turnChange();
    })
})

gameController.turnDisplay();
// console.log(gameController.playerTurn());
// gameController.turnChange();
// console.log(gameController.playerTurn());
// gameController.turnChange();
// console.log(gameController.playerTurn());
martin.play(4);
// helene.play(2);
// gameBoard.show();
// gameBoard.render();
// gameBoard.render();