const gameBoard = (() => {
    const board = [["empty","empty","empty"],["empty","empty","empty"],["empty","empty","empty"]];
    const write = (a,b,string) => {board[a][b] = string;}
    const show = () => {
        console.log(board[0][0] + "|" + board[0][1] + "|" + board[0][2]);
        console.log(board[1][0] + "|" + board[1][1] + "|" + board[1][2]);
        console.log(board[2][0] + "|" + board[2][1] + "|" + board[2][2]);
    }
    return {write, show};
})();

const player = (name) => {
    const getName = () => name;
    const play = (a,b) => {gameBoard.write(a,b,name);}
    return {getName, play};
};

const martin = player("martin");
const helene = player("helene");

console.log(martin.getName());
console.log(helene.getName());
martin.play(1,1);
helene.play(0,2);
gameBoard.show();