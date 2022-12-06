// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input6-sample.txt", "utf8");
const data: string[] = contents.split("\n");

const markers: number[] = [];

for (let i = 0; i < data.length; i++) {
  const buffer = data[i];

  for (let j = 4; j < buffer.length; j++) {
    const chunk = buffer.slice(j - 4, j);
    const uniqueCharactersInChunk = new Set(chunk);

    if (uniqueCharactersInChunk.size === 4) {
      markers.push(j);
      break;
    }
  }
}

const processedCharacters = markers.reduce((p: number, c: number): number => { return p + c }, 0);

console.log(`Processed characters: ${processedCharacters}`);
