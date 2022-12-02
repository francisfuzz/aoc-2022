import {readFileSync} from "fs";

function readFile(fileName: string): string {
    return readFileSync(fileName, "utf8");
}

const contents = readFile("inputs/input2.txt");
const data: Array<string> = contents.split("\n");

console.log(data)
