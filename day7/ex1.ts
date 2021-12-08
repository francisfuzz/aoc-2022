import * as fs from "fs";

// read in test data
const data = fs.readFileSync(`inputs/input7.txt`, 'utf8').split(',').map(Number);

// make an map where key is data[i] and value is sum of (abs data[i] - all other data points)
const map = new Map<number, number>();
data.forEach(d => map.set(d, data.reduce((acc, cur) => acc + Math.abs(d - cur), 0)));

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