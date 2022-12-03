// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input3-sample.txt", "utf8");
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

// Keep processing the queue until there's nothing left
while (rucksackQueue.length > 0) {
  // Create a batch
  const batch = rucksackQueue.slice(0, BATCH_SIZE);

  // ...

  // Update the queue
  rucksackQueue = rucksackQueue.slice(BATCH_SIZE);
}
