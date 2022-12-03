// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input3.txt", "utf8");
const rucksackData: Array<string> = contents.split("\n");

// Map a letter to its priority score.
type AlphabetScorer = {[letter: string]: number};
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabetScorer: AlphabetScorer = (alphabet).split('').reduce((acc: AlphabetScorer, letter: string, index: number) => {
  acc[letter] = index + 1;
  return acc;
}, {});

// Calculate the total priority score given the rucksack data.
const totalScore = rucksackData.reduce((accumulator: number, rucksack: string): number => {
  // Parse the rucksack into its compartments.
  const demarcation = rucksack.length / 2;
  const firstCompartment = rucksack.slice(0, demarcation);
  const secondCompartment = rucksack.slice(demarcation);

  // Create a new set from the first compartment.
  const s = new Set([...firstCompartment.split('')]);

  // Iterate through the second compartment's elements until there's a match.
  for (let i = 0; i < secondCompartment.length; i++) {
    if (s.has(secondCompartment[i])) {
      // Return as soon as the matching letter is found,
      // adding the value to the accumulator.
      return accumulator + alphabetScorer[secondCompartment[i]];
    }
  }

  // If no match is found from the earlier loop, return the accumulator.
  return accumulator;
}, 0);

console.log(totalScore);
