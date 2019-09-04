const minimax = (board, player) => {
    let opponent = 1;
    if (player === 1){opponent =2;}
    let availSpots = [];
    for (let i = 0 ; i<9 ; i++){
        if (board[i]===0){availSpots.push(i);}
    }
    console.log()
    if (winTest(board, player)){
        return 1;
    }
    else if (winTest(board, opponent)){
        return -1;
    }
    let move =-1;
    let score = -2;
    for (let i =0; i<availSpots.length; i++){
        let boardWithNewMove = board;
        boardWithNewMove[availSpots[i]]=player;
        let scoreForTheMove = -1*minimax(boardWithNewMove,opponent);
        if (scoreForTheMove>score){
            score = scoreForTheMove;
            move=i;
        }

    }
    if (move == -1){
        return 0;
    }
    return score;
}





const minimax = (board, playerNumber, index) => {
    let result = 0;
    let newBoard = board
    newBoard[index] = playerNumber;
    if (winTest(newBoard, 2)){
            result = 1;
    }
    else if (winTest(newBoard, 1)){
        result = -1;
    }
    else {
        let newPlayerNumber = playerNumber;
        if (newPlayerNumber === 2){newPlayerNumber = 1;}
        else {newPlayerNumber = 2;}
        let possiblePlay = [];
        for (let i = 0 ; i<9 ; i++){
            if (newBoard[i]===0){possiblePlay.push(i);}
        }
        if (possiblePlay.length > 0){
            for (let i=0;i<possiblePlay.length;i++){
                if (newPlayerNumber === 1){
                    if (result > minimax(newBoard, newPlayerNumber, possiblePlay[i])){
                        result = minimax(newBoard, newPlayerNumber, possiblePlay[i]);
                    }
                }
                else {
                    if (result < minimax(newBoard, newPlayerNumber, possiblePlay[i])){
                        result = minimax(newBoard, newPlayerNumber, possiblePlay[i]);
                    }
                }
            }
        }
    }
    newBoard[index]=0;
    return result;
} 