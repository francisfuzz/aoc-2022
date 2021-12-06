import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("day1/input.txt");
//console.log(contents);

// count the number of times a depth measurement increases from the previous measurement. (There is no measurement before the first measurement.)
function countIncreases(contents: string): number {
    let prev = null;
    let count = 0;
    let lines = contents.split("\n");
    for (let line of lines) {
        let current = parseInt(line);
        if (prev && current > prev) {
            count++;
        }
        prev = current;
    }
    return count;
}

console.log(`The number of times the depth increases is ${countIncreases(contents)}`);