import * as fs from "fs";

// read the file and split on empty line
const [grid, folds] = fs.readFileSync("inputs/input13.txt", "utf8").split("\n\n");
const gridArray = grid.split("\n");
const foldsArray = folds.split("\n");

let maxX = 0;
let maxY = 0;

gridArray.forEach(coord => {
    const [x, y] = coord.split(",").map(Number);
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
});
maxX++;
maxY++;

function printGrid(grid: string[][]) {
    grid.forEach(row => {
        console.log(row.join(""));
    });
}

console.log(`MaxX and MaxY: ${maxX}, ${maxY}`);

let startGrid = new Array<string[]>();
for (let i = 0; i < maxY; i++) {
    startGrid.push(new Array<string>(maxX).fill("."));
}

gridArray.forEach(coord => {
    const [x, y] = coord.split(",").map(Number);
    startGrid[y][x] = "#";
});
//printGrid(startGrid);

function splitGrid(grid: string[][], horizontal: boolean, alongLine: number) {
    if (horizontal) {
        const topGrid = new Array<string[]>();
        const bottomGrid = new Array<string[]>();
        for (let i = 0; i < alongLine; i++) {
            topGrid.push(grid[i]);
        }
        for (let i = grid.length - 1; i > alongLine; i--) {
            bottomGrid.push(grid[i]);
        }
        return [topGrid, bottomGrid];
    } else {
        const leftGrid = new Array<string[]>();
        const rightGrid = new Array<string[]>();
        for (let i = 0; i < grid.length; i++) {
            leftGrid.push(grid[i].slice(0, alongLine));
        }
        for (let i = 0; i < grid.length; i++) {
            rightGrid.push(grid[i].reverse().slice(0, alongLine));
        }
        return [leftGrid, rightGrid];
    }
}

function addGrids(grid1: string[][], grid2: string[][], horizontal: boolean) {
    if (horizontal) {
        for (let i = 0; i < grid2.length; i++) {
            const addRow = grid1[grid1.length - grid2.length + i];
            addRow.forEach((value, index) => {
                if (value === "." && grid2[i][index] === ".") {
                    addRow[index] = ".";
                } else {
                    addRow[index] = "#";
                }
            });
        }
        return grid1;
    } else {
        for (let row = 0; row < grid2.length; row++) {
            for (let col = 0; col < grid2[0].length; col++) {
                const grid1ColIndex = grid1[row].length - grid2[0].length + col;
                let val = "#";
                if (grid1[row][grid1ColIndex] === "." && grid2[row][col] === ".") {
                    val = ".";
                }
                grid1[row][grid1ColIndex] = val;
            }
        }
        return grid1;
    }
}

foldsArray.forEach((fold, i) => {
    const [axis, num] = fold.replace("fold along ", "").split("=");
    const [a, b] = splitGrid(startGrid, axis === "y", Number(num));
    startGrid = addGrids(b, a, axis === "y");
    console.log(`Fold ${i + 1}: ${countVisibleDots(startGrid)}`);
});


//const [t, b] = splitGrid(startGrid, true, 7);
// console.log("Top");
// printGrid(t);
// console.log("Bottom");
// printGrid(b);
//const x = addGrids(b, t, true);
//printGrid(x);

//const [l,r] = splitGrid(x, false, 5);
//const y = addGrids(r, l, false);
//printGrid(y);

printGrid(startGrid);
function countVisibleDots(grid: string[][]) {
    let count = 0;
    grid.forEach(row => {
        row.forEach(value => {
            if (value === "#") {
                count++;
            }
        });
    });
    return count;
}

// console.log("Left");
// printGrid(l);
// console.log("Right");
// printGrid(r);