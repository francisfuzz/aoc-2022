// Setup.
import {readFileSync} from "fs";
import { Z_ASCII } from "zlib";
const contents = readFileSync("inputs/input5-sample.txt", "utf8");
const data: string[] = contents.split("\n");

// Part 1 Prompt
// After the rearrangement procedure completes, what crate ends up on top of each stack?

// The stack data and instructions are separated by a line with the empty string.
const SEPARATOR_INDEX = data.indexOf('');

// Consider a `stackData` of length `n`.
// `stackData[0]`, `stackData[1]`, ... `stackData[n-1]` represent a layer of crates per stack.
// `stackData[n]` represents the base layer of named stacks.
// ("1", "2", ..., Z), where Z is the string representation of a positive integer.
const stackData = data.slice(0, SEPARATOR_INDEX);

const system: Array<Array<string>> = [];

const alphabet = new Set([
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z'
]);
const numericStrings = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

while (stackData.length > 0) {
  const layer = stackData.pop() || '';

  for (let i = 0; i < layer.length; i++) {
    const cursor = layer[i];

    if (numericStrings.has(cursor)) {
      system.push([]);
    }

    if (alphabet.has(cursor)) {
      const crate = i - (3 * Math.round(i/4)) - 1;
      system[crate].push(cursor);
    }
  }
}

console.log(system);
