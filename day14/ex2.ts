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
function getHighestAndLowest(charCountMap: Map<string, number>) {
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

function combineCountMaps(leftMap: Map<string, number>, rightMap: Map<string, number>) {
    leftMap.forEach((count, c) => {
        const rightCount = rightMap.get(c) ?? 0;
        leftMap.set(c, count + rightCount);
    });
    rightMap.forEach((count, c) => {
        if (!leftMap.has(c)) {
            leftMap.set(c, count);
        }
    });

    return leftMap;
}

function splitString(str: string) {
    const half = str.length / 2;
    const left = str.substring(0, half);
    const right = str.substring(half);
    return [ left, right ];
}

function addLastPairChar(leftPolymer: string, rightStart: string) {
    if (rightStart.length === 0) return leftPolymer;

    let joinPair = leftPolymer[leftPolymer.length - 1] + rightStart;
    let lastChar = transforms.get(joinPair);
    if (lastChar) {
        leftPolymer += lastChar;
    }
    return leftPolymer;
}

function iteratePolymer(polymer: string, rightPolymerStart: string, i: number, MAX: number): Map<string, number> {
    const [left, right] = splitString(polymer);
    //console.debug(`split: ${left}.${right}`);
    const leftPolymer = addLastPairChar(iterate(left), right[0]);
    const rightPolymer = addLastPairChar(iterate(right), rightPolymerStart);

    //console.log(`i ${i}: ${leftPolymer}${rightPolymer}`);
    if (i === MAX) {
        return combineCountMaps(countChars(leftPolymer), countChars(rightPolymer));
    } else {
        const leftIterateCount = iteratePolymer(leftPolymer, rightPolymer[0], i + 1, MAX);
        const rightIterateCount = iteratePolymer(rightPolymer, rightPolymerStart, i + 1, MAX);
        console.log(`${i}`);
        return combineCountMaps(leftIterateCount, rightIterateCount);
    }
}

polymer = iterate(polymer);

const totalIterations = 40;
let charCount = iteratePolymer(polymer, "", 2, totalIterations);
let x = [...charCount.values()].reduce((a, b) => a + b, 0);
const [h, l, hc, lc] = getHighestAndLowest(charCount);
console.log(`Total chars after ${totalIterations}: ${x}`);
console.log(`Result: ${Number(h) - Number(l)} (${hc} - ${lc})`);