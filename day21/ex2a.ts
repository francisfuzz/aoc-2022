class Universe {
    static player1Wins: number = 0;
    static player2Wins: number = 0;

    constructor(public incomingMoves: number, public player1Turn: boolean, public player1Pos: number, public player1Score: number, public player2Pos: number, public player2Score: number) {
        this.scoreRound();
    }

    scoreRound() {
        if (this.player1Turn) {
            this.player1Pos = (this.player1Pos + this.incomingMoves) % 10;
            this.player1Score += this.player1Pos === 0 ? 10 : this.player1Pos;
        } else {
            this.player2Pos = (this.player2Pos + this.incomingMoves) % 10;
            this.player2Score += this.player2Pos === 0 ? 10 : this.player2Pos;
        }
        if (this.player1Score >= 21) Universe.player1Wins++;
        if (this.player2Score >= 21) Universe.player2Wins++;
        this.player1Turn = !this.player1Turn;
    }

    isWon() {
        return this.player1Score >= 21 || this.player2Score >= 21;
    }

    rollDie() {
        for (let roll1 = 1; roll1 <= 3; roll1++) {
            for (let roll2 = 1; roll2 <= 3; roll2++) {
                for (let roll3 = 1; roll3 <= 3; roll3++) {
                    const thisRoll = roll1 + roll2 + roll3;
                    universes.push(new Universe(thisRoll, !this.player1Turn, this.player1Pos, this.player1Score, this.player2Pos, this.player2Score));
                }
            }
        }
    }
}

const universes: Universe[] = [];
// set up the first universe
const firstUniverse = new Universe(0, false, 4, 0, 5, 0);
firstUniverse.player2Score = 0;
universes.push(firstUniverse);

while (universes.length > 0) {
    const universe = universes.pop()!;
    if (!universe.isWon()) {
        universe.rollDie();
        universes.push(universe);
    }
    console.log(universes.length);
}
console.log("Complete");
console.log(Universe.player1Wins);
console.log(Universe.player2Wins);
