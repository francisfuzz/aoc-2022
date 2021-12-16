import * as fs from "fs";

const tile = fs.readFileSync('inputs/input15-test.txt', 'utf8').split('\n').map(line => line.split('').map(Number));

let WIDTH = tile[0].length;
let HEIGHT = tile.length;

function getVal(row: number, col: number) {
    const tileRow = row % HEIGHT;
    const tileCol = col % WIDTH;

    const rowAdd = Math.floor(row / HEIGHT);
    const colAdd = Math.floor(col / WIDTH);

    const val = tile[tileRow][tileCol] + rowAdd + colAdd;
    return val > 9 ? val - 9 : val;
}

class Node {
    constructor(public distance: number, public r: number, public c: number) { }
}

// dijkstra
const D = new Array(HEIGHT * 5).fill(0).map(() => new Array(WIDTH * 5).fill(-1));
const Q = [new Node(0, 0, 0)];

let NXROW = [-1, 0, 1, 0];
let NXCOL = [0, 1, 0, -1];

while(Q.length > 0) {
    const curNode = Q.pop()!;
    const [dist, r, c] = [curNode.distance, curNode.r, curNode.c];

    if (r < 0 || c < 0 || r >= HEIGHT * 5 || c >= WIDTH * 5) {
        continue;
    }
    const val = getVal(r, c);

    if (D[r][c] === -1 || curNode.distance + val < D[r][c]) {
        D[r][c] = dist + val;
    } else {
        continue;
    }

    console.log(`${r} ${c} ${val} ${dist}`);
    //if (r === (HEIGHT * 5) - 1 && c === (WIDTH * 5) - 1) break;

    for (let i = 0; i < 4; i++) {
        const nextRow = r + NXROW[i];
        const nextCol = c + NXCOL[i];
        Q.push(new Node(D[r][c], nextRow, nextCol));
    }
}

console.log(`Result: ${D[(HEIGHT * 5) - 1][(WIDTH * 5) - 1] - tile[0][0]}`);
