import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("inputs/input2.txt");
//console.log(contents);

// keep 2 counts: horizontal and vertical.
// for every line of the file:
// if line starts with 'forward' then add the number that follows to the horizontal count
// if line starts with 'up' then decrease the vertical count by the number that follows
// if line starts with 'down' then increase the vertical count by the number that follows
function countSteps(contents: string): number {
    let horizontal = 0;
    let vertical = 0;
    let lines = contents.split("\n");
    for (let line of lines) {
        if (line.startsWith("forward")) {
            horizontal += parseInt(line.substring(8));
        } else if (line.startsWith("up")) {
            vertical -= parseInt(line.substring(3));
        } else if (line.startsWith("down")) {
            vertical += parseInt(line.substring(5));
        }
    }
    return horizontal * vertical;
}

console.log(`Final position is ${countSteps(contents)}`);