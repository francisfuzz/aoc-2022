// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input6-sample.txt", "utf8");
const data: string[] = contents.split("\n");

console.log(data);
