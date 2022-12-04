// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input4-sample.txt", "utf8");
const data: Array<string> = contents.split("\n");

// Part 1 Prompt
// In how many assignment pairs does one range fully contain the other?
console.log(data);
