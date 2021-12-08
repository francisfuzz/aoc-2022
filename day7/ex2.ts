import * as fs from "fs";

// read in test data
const data = fs.readFileSync(`inputs/input7.txt`, 'utf8').split(',').map(Number);

// fn to calculate sum of 1..n
function recSum(n: number): number {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// console.log(recSum(0));
// console.log(recSum(1));
// console.log(recSum(4));
// console.log(recSum(11));

const map = new Map<number, number>();
let positions = Array.from(Array(Math.max(...data)).keys()).map(x => x + 1);
console.log(positions);

positions.forEach(d => map.set(d, data.reduce((acc, cur) => acc + recSum(Math.abs(d - cur)), 0)));

// find the key with the smallest value
let min = Number.MAX_SAFE_INTEGER;
let minKey = 0;
map.forEach((v, k) => {
    if (v < min) {
        min = v;
        minKey = k;
    }
});

console.log(`Min fuel required to move to ${minKey} is ${min}`);