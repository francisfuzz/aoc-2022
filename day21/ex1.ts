// input : 1 starts at 4, 2 at 5

let di = 1;
function rollDie() {
    return di++ + di++ + di++;
}

function getPos(curPos: number, moves: number) {
    let newPos = (curPos + moves) % 10;
    return newPos === 0 ? 10 : newPos;
}

function isWon(player1Total: number, player2Total: number) {
    return player1Total >= 1000 || player2Total >= 1000;
}

function play(player1Start: number, player2Start: number) {
    let player1Total = 0;
    let player1Pos = player1Start;
    let player2Total = 0;
    let player2Pos = player2Start;
    let rounds = 0;
    let won = false;
    while (!won) {
        rounds++;
        player1Pos = getPos(player1Pos, rollDie());
        player1Total += player1Pos;
        if (!isWon(player1Total, player2Total)) {
            rounds++;
            player2Pos = getPos(player2Pos, rollDie());
            player2Total += player2Pos;
        }
        won = isWon(player1Total, player2Total);
    }
    console.log("Rounds: " + rounds);
    console.log("Player 1: " + player1Total);
    console.log("Player 2: " + player2Total);
    return Math.min(player1Total, player2Total) * rounds * 3;
}

// test
//console.log(play(4, 8));

console.log(play(4, 5));