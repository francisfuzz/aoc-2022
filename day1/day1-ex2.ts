import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

function countIncreases(sums: number[]): number {
    let prev = null;
    let count = 0;
    for (let num of sums) {
        let current = num;
        if (prev && current > prev) {
            count++;
        }
        prev = current;
    }
    return count;
}

function sumWindows(depths: number[]): number[] {
    let sums = [];
    for (let i = 0; i < depths.length; i++) {
        let sum = depths[i];
        if (i + 1 < depths.length) {
            sum += depths[i + 1];
            if (i + 2 < depths.length) {
                sum += depths[i + 2];
                sums.push(sum);
            }
        }
    }
    return sums;
}

let contents = readFile("inputs/input1.txt");
let depths = contents.split("\n").map(x => parseInt(x));
let windows = sumWindows(depths);
let count = countIncreases(windows);
console.log(`Sliding window increases: ${count}`);