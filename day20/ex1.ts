import * as fs from 'fs';

const offSetMap = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

function lookupValue(code: string) {
    const binValue = code.replace(/\./gi, "0").replace(/#/gi, "1");
    const index = parseInt(binValue, 2);
    return map[index];
}

function printImage(image: string[]) {
    image.forEach(row => console.log(row));
}

function findStringForPixel(image: string[], row: number, col: number, outsideIsLit: boolean): string {
    let code = "";
    for (let offset = 0; offset < offSetMap.length; offset++) {
        const [rowOffset, colOffset] = offSetMap[offset];
        const lookupRow = row + rowOffset;
        const lookupCol = col + colOffset;
        if (lookupRow >= 0 && lookupRow < image.length && lookupCol >= 0 && lookupCol < image[0].length) {
            code += image[lookupRow][lookupCol];
        } else {
            code += map[0] === "." ? "." : outsideIsLit ? "#" : ".";
        }
    }
    return code;
}

function enhance(inputImage: string[], outsideIsLit: boolean): string[] {
    const outputImage = [];
    for (let row = -1; row <= inputImage.length; row++) {
        let newRow = "";
        for (let col = -1; col <= inputImage[0].length; col++) {
            const code = findStringForPixel(inputImage, row, col, outsideIsLit);
            const pixel = lookupValue(code);
            newRow += pixel;
        }
        outputImage.push(newRow);
    }
    return outputImage;
}

function countLightPixels(image: string[]) {
    return image.reduce((acc, row) => row.replace(/\./gi, "").length + acc, 0);
}

function enhanceNTimes(inputImage: string[], n: number) {
    let image = inputImage;
    for (let i = 1; i <= n; i++) {
        image = enhance(image, i % 2 === 0);
        //printImage(image);
        console.log("");
    }
    return image;
}

// read in the input file
const input = fs.readFileSync('inputs/input20.txt', 'utf8').split("\n");
const map = input[0];
const inputImage = input.slice(2);

console.log("Part 1:");
let enhanced = enhanceNTimes(inputImage, 2);
printImage(enhanced);
console.log("");
console.log(`Count of light pixels: ${countLightPixels(enhanced)}`);

console.log("Part 2:");
enhanced = enhanceNTimes(inputImage, 50);
printImage(enhanced);
console.log("");
console.log(`Count of light pixels: ${countLightPixels(enhanced)}`);