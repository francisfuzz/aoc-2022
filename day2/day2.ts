import {readFileSync} from "fs";

const contents = readFileSync("inputs/input2.txt", "utf8");
const encryptedStrategyGuide: Array<string> = contents.split("\n");
console.log(encryptedStrategyGuide);
