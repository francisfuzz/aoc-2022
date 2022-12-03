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

