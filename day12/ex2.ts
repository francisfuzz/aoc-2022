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

function getSmallCaveMap(paths: string[]) {
    const smallCaveMap = new Map<string, number>();
    paths.filter(c => isSmallCave(c)).forEach(c => {
        if (smallCaveMap.has(c)) {
            smallCaveMap.set(c, (smallCaveMap.get(c) ?? 0) + 1);
        } else {
            smallCaveMap.set(c, 1);
        }
    });
    return smallCaveMap;
}

const endPaths = new Array<Array<string>>();
function navigateToEnd(previousPaths: string[], currentCave: string) {
    if (currentCave === "end") {
        previousPaths.push(currentCave);
        endPaths.push(previousPaths);
        return;
    }

    const curIsSmall = isSmallCave(currentCave);
    if (!curIsSmall) {
        previousPaths.push(currentCave);
    } else {
        const smallCaveMap = getSmallCaveMap(previousPaths);
        const myCount = smallCaveMap.get(currentCave) ?? 0;
        const otherSmallCaveWith2 = [];
        smallCaveMap.forEach((count, cave) => {
            if (count === 2 && cave !== currentCave) otherSmallCaveWith2.push(cave);
        });
        if ((otherSmallCaveWith2.length === 0 && myCount < 2) ||
            (otherSmallCaveWith2.length === 1 && myCount < 1)) {
            previousPaths.push(currentCave);
        } else {
            return;
        }
    }

    const nextCaves = cavesFrom(currentCave).filter(cave => {
        if (isSmallCave(cave)) {
            const smallCaveMap = getSmallCaveMap(previousPaths);
            return (smallCaveMap.get(cave) ?? 0) < 2;
        }
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
// const results = fs.readFileSync("inputs/input12-test1-res.txt", "utf8").split("\n");
// const endPathStrings = endPaths.map(path => path.join(","));
// results.forEach(res => {
//     if (!endPathStrings.includes(res)) console.log(res);
// });

console.log(`Total paths: ${endPaths.length}`);