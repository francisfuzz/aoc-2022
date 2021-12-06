import * as fs from "fs";

// Track horizontal, depth and aim, all starting at 0.
// Read in a file of inputs. For every line of the file:
// "down X" increases your aim by X units.
// "up X decreases" your aim by X units.
// forward X does two things:
// It increases your horizontal position by X units.
// It increases your depth by your aim multiplied by X.
function run() {
    let horizontal = 0;
    let depth = 0;
    let aim = 0;
    let file = fs.readFileSync("inputs/input2.txt", "utf8");

    let instructions = file.split("\n");
    for (let i = 0; i < instructions.length; i++) {
        let instruction = instructions[i];
        if (instruction.startsWith("down")) {
            aim += Number(instruction.split(" ")[1]);
        }
        else if (instruction.startsWith("up")) {
            aim -= Number(instruction.split(" ")[1]);
        }
        else if (instruction.startsWith("forward")) {
            horizontal += Number(instruction.split(" ")[1]);
            depth += aim * Number(instruction.split(" ")[1]);
        }
    }
    console.log("Final horizontal: " + horizontal);
    console.log("Final depth: " + depth);

    console.log(`result is ${horizontal * depth}`);
}

run();