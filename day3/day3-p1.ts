// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input3-sample.txt", "utf8");
const rucksackData: Array<string> = contents.split("\n");

type AlphabetScorer = {[letter: string]: number};

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const alphabetScorer: AlphabetScorer = (alphabet.concat(alphabet.toUpperCase())).split('').reduce((acc: AlphabetScorer, letter: string, index: number) => {
  acc[letter] = index + 1;
  return acc;
}, {});

let totalScore = 0

const r = rucksackData.forEach((rucksack: string) => {
  const demarcation = rucksack.length / 2;
  const firstCompartment = rucksack.slice(0, demarcation);
  const secondCompartment = rucksack.slice(demarcation);

  // Create a new set from the first compartment
  const s = new Set([...firstCompartment.split('')]);

  // Return as soon as the matching letter is found.
  for (let i = 0; i < secondCompartment.length; i++) {
    if(s.has(secondCompartment[i])) {
      totalScore += alphabetScorer[secondCompartment[i]];
      return;
    }
  }
});

console.log(totalScore);
