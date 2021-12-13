import * as fs from "fs";

function cavesFrom(cave: string) {
    const caves = new Set<string>();
    pathMap.forEach(path => {
        const [a, b] = path.split("-");
        if (a === cave && b !== "start") {
            caves.add(b);
        }
        if (b === cave && a !== "start") {
            caves.add(a);
        }
    });
    return [...caves];
}

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

const endPaths = new Array<Array<string>>();
function navigateToEnd(previousPaths: string[], currentCave: string) {
    if (currentCave === "end") {
        previousPaths.push(currentCave);
        endPaths.push(previousPaths);
        return;
    }

    const curIsSmall = isSmallCave(currentCave);
    if ((curIsSmall && !previousPaths.includes(currentCave)) || !curIsSmall) {
        previousPaths.push(currentCave);
    } else {
        return;
    }

    const nextCaves = cavesFrom(currentCave).filter(cave => {
        if (isSmallCave(cave)) return !previousPaths.includes(cave);
        return true;
    });
    nextCaves.forEach(cave => {
        navigateToEnd(previousPaths.map(i => i), cave);
    });
}

const pathMap = fs.readFileSync("inputs/input12.txt", "utf8").split("\n");

navigateToEnd([], "start");
// endPaths.forEach(path => {
//     console.log(path.join(","));
// });
console.log(`Total paths: ${endPaths.length}`);