import * as fs from 'fs';

// function to increment map value at key by 1, if there is no value at key, set it to 1
function initFish(fish: Map<number, number>, key: number) {
    let newVal = fish.get(key) || 0;
    newVal++;
    fish.set(key, newVal);
}

// function that takes number day and iterates a map of number,number pairs
// if key - (day % 9) < 0, double the value
function spawn(fish: Map<number, number>) {
  let newFish = new Map<number, number>();
  fish.forEach((value, key) => {
    newFish.set((key + 8) % 9, value);
  });
  
  // spawn
  let o6 = fish.get(0) || 0;
  let n6 = newFish.get(6) || 0;
  newFish.set(6, o6 + n6);
  return newFish;
}

// read in test data
const data = fs.readFileSync(`inputs/input6.txt`, 'utf8').split(',').map(Number);

// create a map with the data as key and count as value
let fish = new Map<number, number>();
data.forEach(d => { initFish(fish, d); });

let days = 256;
for (let i = 0; i < days; i++) {
  fish = spawn(fish);

  let sum = 0;
  fish.forEach((value, _) => { sum += value; });
  console.log(`After ${i + 1} days, the sum of all fish is ${sum}`);
  console.log("");
}

// sum the values of the map
// let sum = 0;
// fish.forEach((value, _) => { sum += value; });
// console.log(`After ${days} days, the sum of all fish is ${sum}`);
