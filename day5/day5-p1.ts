// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input5.txt", "utf8");
const data: string[] = contents.split("\n");

// Part 1 Prompt
// After the rearrangement procedure completes, what crate ends up on top of each stack?

// The stack data and instructions are separated by a line with the empty string.
const SEPARATOR_INDEX = data.indexOf('');
const stackData = data.slice(0, SEPARATOR_INDEX);
const instructionsData = data.slice(SEPARATOR_INDEX + 1);
const system: Array<Array<string>> = [];

// Define a set of string characters in the range of A-Z
const alphabet = new Set([
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z'
]);
// Define a set of string charaters in the range of 1-9
const numericStrings = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

// Iterate through each layer of the stack data.
while (stackData.length > 0) {
  // Select the last element of the stack data.
  // In the off chance that what's popped is `undefined`, default to the empty string.
  const layer = stackData.pop() || '';

  // Iterate through each of the characters in the layer.
  for (let i = 0; i < layer.length; i++) {
    // Set the cursor to the current element being processed in the layer.
    const cursor = layer[i];

    // If the cursor is a number, we're in the base layer.
    // Update the `system` with a new array representing a new stack.
    if (numericStrings.has(cursor)) {
      system.push([]);
    }

    // If the cursor is a letter, we're in a crate layer.
    if (alphabet.has(cursor)) {
      // The cursor is the crate.
      // Determine the stack position based on the cursor position arithmetic.
      const stack = i - (3 * Math.round(i/4)) - 1;
      // Push the crate into the appropriate stack.
      system[stack].push(cursor);
    }
  }
}

// Iterate through each of the instructions until none are left.
while (instructionsData.length > 0) {
  // Process the first element of the instructions data.
  // This mutates the `instructionsData`.
  const rawInstruction = instructionsData.shift() || '';

  // Create a regex that matches at least one digit and at most two digits.
  const re = /(\d{1,2})/g;

  // Attempt to find the numbers in the raw instructions.
  const found = rawInstruction.match(re);

  // Only process the matches if non-null and for this exact length.
  if (found !== null && found.length === 3) {
    // Given the outline of the instruction:
    // move {cratesToMove} from {sourceStack} to {targetStack}
    // ... set constants based on these matches and coerce them to integers.
    const [cratesToMove, sourceStack, targetStack] = found.map(i => parseInt(i))

    // Move the crates using Array#push and Array#pop
    for (let j = 0; j < cratesToMove; j++) {
      system[targetStack-1].push(system[sourceStack-1].pop() || '');
    }
  }
}

// Finally, grab the "top crate" from each stack and concatenate them all to stdout.
let topCrates = '';
for (let k = 0; k < system.length; k++) {
  const stack = system[k];
  topCrates += stack[stack.length-1];
}
console.log(topCrates);
