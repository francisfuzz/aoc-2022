import * as fs from "fs";

const grid = fs.readFileSync('inputs/input15.txt', 'utf8').split('\n').map(line => line.split('').map(Number));
const WIDTH = grid[0].length;
const HEIGHT = grid.length;

const CACHE = new Map<string, number>();

function solve(row: number, col: number): number {
    if (CACHE.has(`${row},${col}`)) {
        return CACHE.get(`${row},${col}`) || Number.MAX_SAFE_INTEGER;
    }
    if (row < 0 || col < 0 || row >= WIDTH || col >= HEIGHT) {
        return Number.MAX_SAFE_INTEGER;
    }
    if (row === WIDTH - 1 && col === HEIGHT - 1) {
        return grid[row][col];
    }
    const res = grid[row][col] + Math.min(solve(row, col + 1), solve(row + 1, col));
    CACHE.set(`${row},${col}`, res);
    return res;
}

console.log(solve(0, 0) - grid[0][0]);
