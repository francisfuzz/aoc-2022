// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input3.txt", "utf8");
const rucksackData: ReadonlyArray<string> = contents.split("\n");

// Map a letter to its priority score.
type AlphabetScorer = {[letter: string]: number};
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabetScorer: AlphabetScorer = (alphabet).split('').reduce((acc: AlphabetScorer, letter: string, index: number) => {
  acc[letter] = index + 1;
  return acc;
}, {});

// Make a copy of the data
let rucksackQueue: Array<string> = rucksackData.slice();
const BATCH_SIZE = 3;

// Keep a tally of the priority score.
let priorityScore = 0;

// Keep processing the queue until there's nothing left
while (rucksackQueue.length > 0) {
  // Create a batch
  // FRAGILITY: this will break if the rucksack data is no longer divisible by batch size!
  const batch = rucksackQueue.slice(0, BATCH_SIZE).map(r => r.split(''));

  // Create a set for each rucksack.
  // Because a value in a Set may only occur once, that value is unique in its collection.
  const s0 = new Set([...batch[0]]);
  const s1 = new Set([...batch[1]]);
  const s2 = new Set([...batch[2]]);

  // Iterate through each of this set's elements.
  for (const item of s0) {
    // If this element is in all three sets...
    if (s1.has(item) && s2.has(item)) {
      // Add it to the priority score.
      priorityScore += alphabetScorer[item];
    }
  }
  // Update the queue
  rucksackQueue = rucksackQueue.slice(BATCH_SIZE);
}

// Part 2
console.log(`The sum of the priorities of these item types: ${priorityScore}`);
