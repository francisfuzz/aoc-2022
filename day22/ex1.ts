import * as fs from "fs";

function toggleCubes(range: string, onOff: number) {
    const [xrange, yrange, zrange] = range.split(",");
    let [xstart, xend] = xrange.replace(/x=/g, "").split("..").map(Number);
    let [ystart, yend] = yrange.replace(/y=/g, "").split("..").map(Number);
    let [zstart, zend] = zrange.replace(/z=/g, "").split("..").map(Number);

    // part1 - only -50..50 in all axes
    if (xend < -50 || xstart > 50 || yend < -50 || ystart > 50 || zend < -50 || zstart > 50) return;
    xstart = Math.max(-50, xstart);
    xend = Math.min(50, xend);
    ystart = Math.max(-50, ystart);
    yend = Math.min(50, yend);
    zstart = Math.max(-50, zstart);
    zend = Math.min(50, zend);

    for (let x = xstart; x <= xend; x++) {
        for (let y = ystart; y <= yend; y++) {
            for (let z = zstart; z <= zend; z++) {
                const point = `${x},${y},${z}`;
                cubeMap.set(point, onOff);
            }
        }
    }
}

function boot(instructions: string[]) {
    instructions.forEach(line => {
        const [cmd, points] = line.split(" ");
        toggleCubes(points, cmd === "on" ? 1 : 0);
    });

    return [...cubeMap.values()].reduce((a, b) => a + b);
}

const instructions = fs.readFileSync("inputs/input22.txt", "utf8").split("\n");
const cubeMap = new Map<string, number>();

console.log(boot(instructions));