import * as fs from "fs";

// read in a file
const input = fs.readFileSync("inputs/input4.txt", "utf8");

// first line is the random list of numbers
const numbers = input.split("\n")[0].split(",").map(Number);

// remainder of lines are the boards, split by an empty line
const boards = input.split("\n\n").slice(1);

console.log(`numbers: ${numbers}`);
console.log(`number of boards: ${boards.length}`);
console.log(`board 1: ${boards[0]}`);

class Board {
    hlines = <number[][]>[];
    vlines = <number[][]>[];
    
    constructor(public id: number, public board: string[]) {
        // each line split by space and trim
        this.hlines = board.map(line => line.split(" ").filter(l => l.length > 0).map(Number));
        this.vlines = [];
        for(let i = 0; i < 5; i++) {
            this.vlines.push([this.hlines[0][i], this.hlines[1][i], this.hlines[2][i], this.hlines[3][i], this.hlines[4][i]]);
        }
    }

    mark(num: number) {
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 5; j++) {
                if(this.hlines[i][j] === num) {
                    this.hlines[i][j] = -1;
                }
                if(this.vlines[i][j] === num) {
                    this.vlines[i][j] = -1;
                }
            }
        }

        // if all the numbers in any line are -1, return true
        for(let line of [...this.hlines, ...this.vlines]) {
            if (line.findIndex(n => n !== -1) === -1) {
                return true;
            }
        }
        return false;
    }

    // sum the total of all non-negative numbers in the board
    remainderSum(): number {
        let sum = 0;
        for(let line of this.hlines) {
            for(let num of line) {
                if(num > 0) {
                    sum += num;
                }
            }
        }
        return sum;
    }

    display() {
        console.log("");
        for(let line of this.hlines) {
            console.log(line);
        }
    }
}

// create a Board for each element of boards
const boardsObj = boards.map((board, id) => new Board(id, board.split("\n")));

let lastNum = 0;
let remainder = 0;
for (let i = 0; i < numbers.length; i++) {
    lastNum = numbers[i];
    console.log(`Calling number ${lastNum}`);
    
    let bingo = false;
    for(let board of boardsObj) {
        if(board.mark(lastNum)) {
            bingo = true;
            remainder = board.remainderSum();
            break;
        }
    }

    if(!bingo) {
        console.log("No bingo");
    } else {
        console.log("BINGO!!");
        break;
    }
}

console.log(`Result is ${lastNum * remainder}`);