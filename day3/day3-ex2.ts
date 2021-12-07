import * as fs from "fs";

// read in a file and print it out to the console
function readFile(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
}

let contents = readFile("inputs/input3.txt");

// read in a file and split on newline
let lines = contents.split("\n");

function filter(position: number, mostCommon: boolean, lines: string[]): string[] {
    console.log(`position: ${position}, mostCommon: ${mostCommon}, lines length: ${lines.length}`);
    if (lines.length === 1) { return lines; }

    let matches0 = lines.filter(line => line.charAt(position) === "0");
    let matches1 = lines.filter(line => line.charAt(position) === "1");

    if (mostCommon) {
        if (matches0.length > matches1.length) return filter(position + 1, mostCommon, matches0);
        return filter(position + 1, mostCommon, matches1);
    } else {
        if (matches0.length <= matches1.length) return filter(position + 1, mostCommon, matches0);
        return filter(position + 1, mostCommon, matches1);
    }
}

let oxygen = filter(0, true, lines)[0];
let oxygenDecimal = parseInt(oxygen, 2);

let co2 = filter(0, false, lines)[0];
let co2Decimal = parseInt(co2, 2);

console.log(`Oxygen: ${oxygen}, ${oxygenDecimal}`);
console.log(`CO2: ${co2}, ${co2Decimal}`);
console.log(`Result: ${oxygenDecimal * co2Decimal}`);
