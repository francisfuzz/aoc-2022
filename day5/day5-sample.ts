// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input5-sample.txt", "utf8");
const data: Array<string> = contents.split("\n");

// Part 1 Prompt
// After the rearrangement procedure completes, what crate ends up on top of each stack?
console.log(data);
