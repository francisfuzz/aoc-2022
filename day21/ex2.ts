// class Player {
//     public pos: number;
//     public score: number;

//     constructor(pos: number, score: number);
//     constructor(player: Player);
    
//     constructor(...args: any[]) {
//         if (args.length === 2) {
//             this.pos = args[0];
//             this.score = args[1];
//         } else {
//             this.pos = args[0].pos;
//             this.score = args[0].score;
//         }
//     }

//     scoreRound(moves: number) {
//         this.pos = (this.pos + moves) % 10;
//         this.score += this.pos === 0 ? 10 : this.pos;
//     }
// }

// class UniverseGame {
//     static player1Wins: number = 0;
//     static player2Wins: number = 0;

//     constructor(public player1: Player, public player2: Player, public player1Turn: boolean, public throwVal: number) {
//     }

//     playToEnd() {
//         if (this.player1Turn) {
//             this.player1.scoreRound(this.throwVal);
//         } else {
//             this.player2.scoreRound(this.throwVal);
//         }
//         while (!this.isWon()) {
//             this.player1Turn = !this.player1Turn;
//             this.rollDie();
//         }
//     }

//     rollDie() {
//         for (let roll1 = 1; roll1 <= 3; roll1++) {
//             for (let roll2 = 1; roll2 <= 3; roll2++) {
//                 for (let roll3 = 1; roll3 <= 3; roll3++) {
//                     const thisRoll = roll1 + roll2 + roll3;
//                     universes.push(new UniverseGame(new Player(this.player1), new Player(this.player2), this.player1Turn, thisRoll));
//                     this.player1Turn = !this.player1Turn;
//                 }
//             }
//         }
//     }

//     isWon() {
//         return this.player1.score >= 21 || this.player2.score >= 21;
//     }
// }

// const uni1 = new UniverseGame(new Player(4, 0), new Player(5, 0), true);
// const universes: UniverseGame[] = [];
// universes.push(uni1);
// while(universes.length > 0) {
//     const u = universes.pop()!;
//     if (u.rollDie()) {
//         universes.push(u);
//     }
// }

// console.log(UniverseGame.player1Wins);
// console.log(UniverseGame.player2Wins);