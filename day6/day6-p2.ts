// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input6.txt", "utf8");
const data: string[] = contents.split("\n");

// Prompt 2
// How many characters need to be processed before the first start-of-message marker is detected?

// Create a new variable for holding the number of processed characters.
let processedCharacters = 0;

// Iterate through the data, in the case there's more than one datastream buffer.
for (let i = 0; i < data.length; i++) {

  // Cache a reference to the buffer.
  const buffer = data[i];

  // Iterate through 14 characters of the buffer at a time.
  for (let j = 14; j < buffer.length; j++) {

    // Cache a reference to the current slice.
    const chunk = buffer.slice(j - 14, j);

    // Use a set to get the unique characters of the chunk.
    const uniqueCharactersInChunk = new Set(chunk);

    // If there are exactly 14 unique characters...
    if (uniqueCharactersInChunk.size === 14) {
      // Assign the number of processed characters to the current index of this inner-loop.
      processedCharacters = j;
      // Break since there's nothing more we need to do.
      break;
    }
  }
}

console.log(`Processed characters: ${processedCharacters}`);
