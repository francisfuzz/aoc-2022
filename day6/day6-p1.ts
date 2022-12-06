// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input6.txt", "utf8");
const data: string[] = contents.split("\n");

// Prompt 1
// How many characters need to be processed before the first start-of-packet marker is detected?

// Create a new variable for storing the start-of-packet markers for each buffer.
const markers: number[] = [];

// Iterate through the list of buffers.
for (let i = 0; i < data.length; i++) {
  // Cache a reference to the current buffer.
  const buffer = data[i];

  // Iterate through 4 characters of the buffer at a time.
  for (let j = 4; j < buffer.length; j++) {

    // Cache a reference to the current chunk.
    const chunk = buffer.slice(j - 4, j);

    // Use a set to get the unique characters of the chunk.
    const uniqueCharactersInChunk = new Set(chunk);

    // If there are exactly 4 unique characters,
    // push the index to `markers`, as it represents the number of processed characters.
    if (uniqueCharactersInChunk.size === 4) {
      markers.push(j);
      // Stop any further processing since we found what we were looking for.
      break;
    }
  }
}

const processedCharacters = markers.reduce((p: number, c: number): number => { return p + c }, 0);

console.log(`Processed characters: ${processedCharacters}`);
