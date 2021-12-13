import * as fs from "fs";

const input = fs.readFileSync("inputs/input12-test1.txt", "utf8").split("\n");
const caveMap = new Map<string, Set<string>>();

input.forEach(line => {
    const [left, right] = line.split("-");
    if (caveMap.has(left)) {
        caveMap.get(left)?.add(right);
    } else {
        caveMap.set(left, new Set([right]));
    }
    if (caveMap.has(right)) {
        caveMap.get(right)?.add(left);
    } else {
        caveMap.set(right, new Set([left]));
    }
});

// function to deep copy an array
function copyPath(arr: Array<Array<string>>) {
    return arr.map(item => item);
}

// function to determine if a cave is a small cave (it is lower case)
function isSmallCave(cave: string) {
    return cave.toLowerCase() === cave && cave !== "end" && cave !== "start";
}

function addCave(paths: string[], cave: string) {
    if (paths.includes(cave)) {
        if (!paths.some(p => isSmallCave(p))) paths.push(cave);
    } else {
        paths.push(cave);
    }
}

function navigate(curCave: string, prevPaths: Array<Array<string>>): Array<string> {
    prevPaths.forEach(p => {
        addCave(p, curCave);
    });
    const nextPaths = new Array<string>();
    const nextPossibles = caveMap.get(curCave);
    if (nextPossibles) {
        [...nextPossibles].filter(c => c!== "start").forEach(nextCave => {
            const newPaths = copyPath(prevPaths);
            nextPaths.push(...navigate(nextCave, newPaths));
        });
    }
    return nextPaths;
}

let caveKeys = [...caveMap.keys()].filter(key => key !== "start" && key !== "end");
caveKeys = ["start", ...caveKeys];
const paths = navigate("start", [[]]);
