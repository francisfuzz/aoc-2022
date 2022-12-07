// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input6.txt", "utf8");
const data: string[] = contents.split("\n");

// Prompt 1
// How many characters need to be processed before the first start-of-packet marker is detected?

function startOfPacket (buffer: string, distinctCharacters: number): number {
  let numberOfCharactersProcessed = 0;
  for (let i = distinctCharacters; i < buffer.length; i++) {
    if ((new Set(buffer.slice(i - distinctCharacters, i))).size === distinctCharacters) {
      numberOfCharactersProcessed = i;
      break;
    }
  }
  return numberOfCharactersProcessed;
}

console.log(startOfPacket(data[0], 4));
