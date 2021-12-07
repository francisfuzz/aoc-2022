import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("inputs/input3.txt");

// track 2 numbers: gamma and epsilon
// read in a file and split on newline
let lines = contents.split("\n");

// define gamma and epsilon as empty char arrays
let gamma: string[] = [];
let epsilon: string[] = [];

// loop through the chars of the first line
for (let pos = 0; pos < lines[0].length; pos++) {
    let zeros = lines.map(line => line[pos]).filter(char => char === "0").length;
    if (zeros > lines.length / 2) {
        gamma.push("0");
        epsilon.push("1");
    } else {
        gamma.push("1");
        epsilon.push("0");
    }
}

// convert epsilon and gamma from binary to decimal
let gammaDecimal = parseInt(gamma.join(""), 2);
let epsilonDecimal = parseInt(epsilon.join(""), 2);
console.log(`Gamma: ${gamma}, ${gammaDecimal}`);
console.log(`Epsilon: ${epsilon}, ${epsilonDecimal}`);
console.log(`Result is ${gammaDecimal * epsilonDecimal}`);
