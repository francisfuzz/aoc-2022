import {readFileSync} from "fs";

const contents = readFileSync("inputs/input2.txt", "utf8");
// const encryptedStrategyGuide: Array<string> = contents.split("\n");
// console.log(encryptedStrategyGuide);

const sampleGuide: Array<string> = ['A Y', 'B X', 'C Z'];

type ShapeHolder = {[name: string]: number};
type Rubric = {[name: string]: ShapeHolder};

// Converts the letter to the human-readable shape.
function decrypt (letter: string): string {
    switch (letter) {
        case 'A':
        case 'X':
            return 'rock';
        case 'B':
        case 'Y':
            return 'paper';
        case 'C':
        case 'Z':
            return 'scissors';
        default:
            return ''
    }
}

// Computes the score for the selected shape.
function selectedScore(choice: string): number{
    const selectedShapes: ShapeHolder = {
        rock: 1,
        paper: 2,
        scissors: 3
    };

    return selectedShapes[choice] || 0;
}

// Computes the score of the outcome based on two choices, favoring `myChoice`.
function outcomeScore(myChoice: string, opponentChoice: string): number {
    const rubric: Rubric = {
        rock: {
            rock: 3,
            paper: 0,
            scissors: 6,
        },
        paper: {
            rock: 6,
            paper: 3,
            scissors: 0,
        },
        scissors: {
            rock: 0,
            paper: 6,
            scissors: 3,
        }
    };

    return rubric[myChoice][opponentChoice] || 0;
}

const finalScore: number = sampleGuide.reduce((accumulator: number, round: string) => {
    const [opponentChoice, suggestedChoice] = round.split(' ');
    const oc = decrypt(opponentChoice);
    const sc = decrypt(suggestedChoice);

    return accumulator + selectedScore(sc) + outcomeScore(sc, oc)
}, 0)

// Part 1
console.log(`The final score is: ${finalScore}`);
