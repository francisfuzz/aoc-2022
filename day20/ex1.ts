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

// read in the input file
const input = fs.readFileSync('inputs/input20.txt', 'utf8').split("\n");
const map = input[0];
const inputImage = input.slice(2);

function lookupValue(code: string) {
    const binValue = code.replace(/\./gi, "0").replace(/#/gi, "1");
    const index = parseInt(binValue, 2);
    return map[index];
}

function printImage(image: string[]) {
    image.forEach(row => console.log(row));
}

function findStringForPixel(image: string[], row: number, col: number) {
    let code = "";
    for (let offset = 0; offset < offSetMap.length; offset++) {
        const [rowOffset, colOffset] = offSetMap[offset];
        const lookupRow = row + rowOffset;
        const lookupCol = col + colOffset;
        if (lookupRow >= 0 && lookupRow < image.length && lookupCol >= 0 && lookupCol < image[0].length) {
            code += image[lookupRow][lookupCol];
        } else {
            code += ".";
        }
    }
    return code;
}

printImage(inputImage);
const code = findStringForPixel(inputImage, 2, 2);
const pixel = lookupValue(code);
console.log(code);
console.log(pixel);

function enhance(inputImage: string[]) {
    const outputImage = [];
    for (let row = -1; row <= inputImage.length; row++) {
        let newRow = "";
        for (let col = -1; col <= inputImage[0].length; col++) {
            const code = findStringForPixel(inputImage, row, col);
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

console.log("");
console.log("Enhancing...");
let enhaced = enhance(inputImage);
enhaced = enhance(enhaced);
printImage(enhaced);
console.log("");
console.log(`Count of light pixels: ${countLightPixels(enhaced)}`);