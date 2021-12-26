class Universe {
    static player1Wins: number = 0;
    static player2Wins: number = 0;

    constructor(public player1Turn: boolean, public player1Pos: number, public player1Score: number, public player2Pos: number, public player2Score: number) {
    }

    scoreRound(moves: number) {
        if (this.player1Turn) {
            this.player1Pos = (this.player1Pos + moves) % 10;
            this.player1Score += this.player1Pos === 0 ? 10 : this.player1Pos;
        } else {
            this.player2Pos = (this.player2Pos + moves) % 10;
            this.player2Score += this.player2Pos === 0 ? 10 : this.player2Pos;
        }
        if (this.player1Score >= 21) {
            Universe.player1Wins++;
        }
        if (this.player2Score >= 21) Universe.player2Wins++;
        this.player1Turn = !this.player1Turn;
    }

    isWon() {
        return this.player1Score >= 21 || this.player2Score >= 21;
    }
}

function rollDice(universes: Universe[]) {
    const unwonUniverses: Universe[] = [];
    universes.forEach(u => {
        for (let roll1 = 1; roll1 <= 3; roll1++) {
            for (let roll2 = 1; roll2 <= 3; roll2++) {
                for (let roll3 = 1; roll3 <= 3; roll3++) {
                    const thisRoll = roll1 + roll2 + roll3;
                    const newUniverse = new Universe(u.player1Turn, u.player1Pos, u.player1Score, u.player2Pos, u.player2Score);
                    newUniverse.scoreRound(thisRoll);
                    if (!newUniverse.isWon()) {
                        unwonUniverses.push(newUniverse);
                    }
                }
            }
        }
    });
    return unwonUniverses;
}

// set up the first universe
const firstUniverse = new Universe(true, 4, 0, 5, 0);
let universes = [firstUniverse];

while (universes.length > 0) {
    universes = rollDice(universes);
    console.log(universes.length);
}
console.log("Complete");
console.log(Universe.player1Wins);
console.log(Universe.player2Wins);
