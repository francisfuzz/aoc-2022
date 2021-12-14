import * as fs from "fs";

// read input and split by newline
const input = fs.readFileSync("inputs/input14.txt", "utf8").split("\n");

// first line is the polymer template
let polymer = input[0];

// strip the first 2 lines from input
input.shift();
input.shift();
const transforms = new Map<string, string>();
input.forEach(t => {
    const [pair, insert] = t.split(" -> ");
    transforms.set(pair, insert);
});

function iterate(polymer: string) {
    const pairs = [];
    for (let i = 0; i < polymer.length - 1; i++) {
        let pair = polymer.substring(i, i + 2);
        let tx = transforms.get(pair);
        if (tx) {
            pair = pair[0] + tx;
        }
        pairs.push(pair);
    }
    return pairs.join("") + polymer[polymer.length - 1];
}

function countChars(polymer: string) {
    const charCountMap = new Map<string, number>();
    for (let i = 0; i < polymer.length; i++) {
        const char = polymer[i];
        let count = charCountMap.get(char);
        if (!count) {
            count = 0;
        }
        charCountMap.set(char, count + 1);
    }
    return charCountMap;
}

// get the highest and lowest value from the map
function getHighestAndLowest(polymer: string) {
    const charCountMap = countChars(polymer);
    let highest = 0;
    let lowest = Number.MAX_SAFE_INTEGER;
    let highestChar = "";
    let lowestChar = "";

    for (const [char, count] of charCountMap) {
        if (count > highest) {
            highest = count;
            highestChar = char;
        }
        if (count < lowest) {   
            lowest = count;
            lowestChar = char;
        }
    }
    return [ highest, lowest, highestChar, lowestChar ];
}

console.log(`Template: ${polymer}`);
for (let i = 0; i < 10; i++) {
    polymer = iterate(polymer);
    console.log(`After step ${i + 1} [${polymer.length}]: ${polymer}`);
}

const [h, l] = getHighestAndLowest(polymer);
console.log(`Part 1: ${Number(h) - Number(l)}`);