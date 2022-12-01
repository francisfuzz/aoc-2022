import * as fs from "fs";

function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

const contents = readFile("inputs/input1.txt");
const data: string[] = contents.split("\n");

// Prompt
// Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?

// Initialize an array where each element represents the calories an elf is carrying.
// The first element is the first elf with zero calories.
let elves: Array<number> = [0]

data.forEach((element: string) => {
    // If it's an empty string, add a new elf to `elves`
    // If it's not an empty string, parse the integer and add it to the current elf
    if (element === '') {
        elves.push(0)
    } else {
        elves[elves.length-1] += parseInt(element)
    }
});

const elvesSortedDesc: Array<number> = elves.sort((a, b) => b - a)

// Part 1
console.log(`The Elf carrying the most Calories: ${elvesSortedDesc[0]}`)

// Part 2
console.log(`The total weight the top 3 elves are carrying: ${elvesSortedDesc.slice(0,3).reduce((p, c) => p + c, 0)}`)
