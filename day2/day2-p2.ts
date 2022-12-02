// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input2.txt", "utf8");
const encryptedStrategyGuide: Array<string> = contents.split("\n");

type ShapeCounter = {[name: string]: number};
type ScoreRubric = {[name: string]: ShapeCounter};

type Shapes = 'rock' | 'paper' | 'scissors';

type ShapeToShape = {[name: string]: Shapes};
type ShapeMap = {[name: string]: ShapeToShape};

// Converts the letter to the human-readable meaning.
function decrypt (letter: string): string {
    switch (letter) {
        case 'A':
            return 'rock';
        case 'B':
            return 'paper';
        case 'C':
            return 'scissors';
        case 'X':
            return 'lose';
        case 'Y':
            return 'draw';
        case 'Z':
            return 'win';
        default:
            return ''
    }
}

// Computes the score for the selected shape.
function selectedScore(choice: string): number {
    const selectedShapes: ShapeCounter = {
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
function outcomeScore (myChoice: string, opponentChoice: string): number {
    const rubric: ScoreRubric = {
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

// Returns the shape to counter an opponent's choice with given a desired outcome.
function counterShape (opponentChoice: string, desiredOutcome: string): string {
    const rubric: ShapeMap = {
        rock: {
            win: 'paper',
            draw: 'rock',
            lose: 'scissors',
        },
        paper: {
            win: 'scissors',
            draw: 'paper',
            lose: 'rock',
        },
        scissors: {
            win: 'rock',
            draw: 'scissors',
            lose: 'paper',
        },
    }

    return rubric[opponentChoice][desiredOutcome] || '';
}

// Compute and assign the final score to its own variable.
const totalScore = encryptedStrategyGuide.reduce((accumulator: number, round: string): number => {
    // Parse the round's respective inputs.
    const [opponentChoice, desiredOutcome] = round.split(' ');

    // Obtain the human-readable values of these inputs.
    const oc = decrypt(opponentChoice);
    const desired = decrypt(desiredOutcome);

    // Compute my choice based on the opponent's choice and desired outcome.
    const myChoice = counterShape(oc, desired);

    // Compute the total score: take the sum of the selected score for my choice and the outcome score.
    const ts = selectedScore(myChoice) + outcomeScore(myChoice, oc);

    // Add this round's total score to the `totalScore`.
    return accumulator + ts;
}, 0)

// Part 2
console.log(`The total score is ${totalScore}`);
