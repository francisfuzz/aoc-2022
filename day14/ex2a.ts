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

function combineCountMaps(leftMap: Map<string, number>, rightMap: Map<string, number>) {
    const newMap = new Map<string, number>();
    leftMap.forEach((count, c) => {
        const rightCount = rightMap.get(c) ?? 0;
        newMap.set(c, count + rightCount);
    });
    rightMap.forEach((count, c) => {
        if (!newMap.has(c)) {
            newMap.set(c, count);
        }
    });

    return newMap;
}

const resultStore = new Map<string, Map<string, number>>();

function countPairForIterations(pair: string, iterations: number): Map<string, number> {
    const comboKey = `${pair}-${iterations}`;
    const cachedResult = resultStore.get(comboKey);
    if (cachedResult) {
        return cachedResult;
    }

    if (transforms.has(pair)) {
        const insert = transforms.get(pair);

        if (iterations === 0) {
            const res = countChars(pair[0] + insert);
            resultStore.set(comboKey, res);
            return res;
        }

        const leftExpansionCount = countPairForIterations(pair[0] + insert, iterations - 1);
        const rightExpansionCount = countPairForIterations(insert + pair[1], iterations - 1);
        const res = combineCountMaps(leftExpansionCount, rightExpansionCount);
        resultStore.set(comboKey, res);
        return res;
    }
    return new Map<string, number>();
}

let countMap = new Map<string, number>();
const totalIterations = 40;
for (let i = 0; i < polymer.length - 1; i++) {
    let pair = polymer.substring(i, i + 2);
    //console.log(pair);
    countMap = combineCountMaps(countMap, countPairForIterations(pair, totalIterations - 1));
}
const lastCharCount = countMap.get(polymer[polymer.length - 1]);
if (lastCharCount) {
    countMap.set(polymer[polymer.length - 1], lastCharCount + 1);
}

const [h, l] = getHighestAndLowest(countMap);
console.log(`Result is ${Number(h) - Number(l)}`);