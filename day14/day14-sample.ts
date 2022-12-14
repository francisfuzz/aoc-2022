// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input14-sample.txt", "utf8");
const data: string[] = contents.split("\n");

data.pop(); // TRIM THAT INPUT!

let minX = Infinity;
let maxX = -Infinity;
// const minY = 0;
let maxY = -Infinity;

const paths = data.map(path => {
  const points: number[][] = path.split(" -> ").map((point: string) => {
    const [x, y] = point.trim().split(',').map(n => { return parseInt(n); });

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    return [x, y];
  });

  return points;
});

let cave = new Array(maxY+1).fill(new Array(maxX-minX+1).fill('.'));

paths.forEach(path => {
  path.forEach((point, index) => {
    if (index === path.length - 1) {
      return;
    }
    let thisPoint = point;
    let nextPoint = path[index+1];

    // If nextPoint is less than thisPoint, swap them.
    if (nextPoint[0] < thisPoint[0]) {
      [thisPoint, nextPoint] = [nextPoint, thisPoint];
    }

    for (let i = thisPoint[0] - minX; i <= nextPoint[0] - minX; i++) {
      cave[i][thisPoint[1]] = '#';
    }

    if (nextPoint[1] < thisPoint[1]) {
      [thisPoint, nextPoint] = [nextPoint, thisPoint];
    }

    for (let i = thisPoint[1]; i <= nextPoint[1]; i++) {
      cave[thisPoint[0] - minX][i] = '#';
    }
  });
});

for (let i = 0; i < cave.length; i++) {
  console.log(cave[i].join(''));
}