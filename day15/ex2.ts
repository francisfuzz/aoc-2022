import * as fs from "fs";

const tile = fs.readFileSync('inputs/input15.txt', 'utf8').split('\n').map(line => line.split('').map(Number));

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

// convenience
let NXROW = [-1, 0, 1,  0];
let NXCOL = [ 0, 1, 0, -1];

// dijkstra
function solve(tileCount: number) {
    const D = new Array(HEIGHT * tileCount).fill(0).map(() => new Array(WIDTH * tileCount).fill(undefined));
    const Q = [new Node(0, 0, 0)];
    
    let iter = 0;
    while(Q.length > 0) {
        iter++;

        // pop the smallest distance node off the Q
        let curNode = Q[0];
        for(let i = 1; i < Q.length; i++) {
            if(Q[i].distance < curNode.distance) {
                curNode = Q[i];
            }
        }
        Q.splice(Q.indexOf(curNode), 1);
        
        const [dist, r, c] = [curNode.distance, curNode.r, curNode.c];

        if (r < 0 || c < 0 || r >= HEIGHT * tileCount || c >= WIDTH * tileCount) {
            continue;
        }
        const cost = dist + getVal(r, c);

        if (D[r][c] === undefined || cost < D[r][c]) {
            D[r][c] = cost;
        } else {
            continue;
        }

        //console.log(`[${iter}] ${r} ${c} ${dist} ${cost}`);
        if (r === (HEIGHT * tileCount) - 1 && c === (WIDTH * tileCount) - 1) {
            break;
        }

        for (let i = 0; i < 4; i++) {
            const nextRow = r + NXROW[i];
            const nextCol = c + NXCOL[i];
            Q.push(new Node(D[r][c], nextRow, nextCol));
        }

    }
    console.log(`${iter} iterations`);
    return D[(HEIGHT * tileCount) - 1][(WIDTH * tileCount) - 1] - tile[0][0]
}

console.log(solve(1));
console.log(solve(5));
