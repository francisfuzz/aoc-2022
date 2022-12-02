// Setup.
import {readFileSync} from "fs";
// const contents = readFileSync("inputs/input2.txt", "utf8");
// const encryptedStrategyGuide: Array<string> = contents.split("\n");

const encryptedStrategyGuide = ['A Y', 'B X', 'C Z']

type ShapeCounter = {[name: string]: number};
type ScoreRubric = {[name: string]: ShapeCounter};

type ShapeToShape = {[name: string]: string};
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
encryptedStrategyGuide.forEach((round: string) => {
    // Parse the round's respective inputs.
    const [opponentChoice, desiredOutcome] = round.split(' ');

    // Obtain the human-readable values of these inputs.
    const oc = decrypt(opponentChoice);
    const desired = decrypt(desiredOutcome);
    const myChoice = counterShape(oc, desired);
    const ts = selectedScore(myChoice) + outcomeScore(myChoice, oc)

    console.log(`Opponent is ${oc}.`)
    console.log(`Desired outcome is ${desired}.`)
    console.log(`The choice I need to make is ${myChoice}.`)

    console.log(`The selected shape score is ${selectedScore(myChoice)}.`)
    console.log(`The outcome score is ${outcomeScore(myChoice, oc)}.`)
    console.log(`${selectedScore(myChoice)} + ${outcomeScore(myChoice, oc)} = ${ts}.`)
})
