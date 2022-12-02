// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input2.txt", "utf8");
const encryptedStrategyGuide: Array<string> = contents.split("\n");

// Custom type to model a shape and its value.
type ShapeHolder = {[name: string]: number};
// Custom type that composes any name to a shape and its value.
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
function selectedScore(choice: string): number {
    const selectedShapes: ShapeHolder = {
        rock: 1,
        paper: 2,
        scissors: 3
    };

    return selectedShapes[choice] || 0;
}

// Computes the score of the outcome based on two choices, favoring `myChoice`.
// Score mapping:
// `0` is a loss
// `3` is a draw
// `6` is a win
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

// Compute and assign the final score to its own variable.
const finalScore: number = encryptedStrategyGuide.reduce((accumulator: number, round: string) => {
    // Parse the round's respective inputs.
    const [opponentChoice, suggestedChoice] = round.split(' ');

    // Obtain the human-readable values of these choices.
    const oc = decrypt(opponentChoice);
    const sc = decrypt(suggestedChoice);

    // Return the sum of the previous sums, the selected score of the suggested choice, and the outcome score.
    return accumulator + selectedScore(sc) + outcomeScore(sc, oc)
}, 0)

// Part 1
console.log(`The final score is: ${finalScore}`);
