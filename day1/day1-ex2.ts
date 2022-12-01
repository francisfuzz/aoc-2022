import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("inputs/input1.txt");
console.log(contents);
