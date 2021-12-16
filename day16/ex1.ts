import * as fs from "fs";

function convertHexToBinary(hex: string) {
    const hexToBinary: any = {
        0: "0000",
        1: "0001",
        2: "0010",
        3: "0011",
        4: "0100",
        5: "0101",
        6: "0110",
        7: "0111",
        8: "1000",
        9: "1001",
        A: "1010",
        B: "1011",
        C: "1100",
        D: "1101",
        E: "1110",
        F: "1111"
    };
    return hex.split("").reduce((acc, curr) => acc + hexToBinary[curr], "");
}

function convertToBinary(str: string) {
    return str.split("").reduce((acc, curr) => acc * 2 + parseInt(curr), 0);
}


// types
const LITERAL = 4;

class Packet {
    public version = -1;
    public type = -1;
    
    hexPos = 0;
    binaryPos = 0;
    curWord = "";

    public literal = 0;

    public childPackets = new Array<Packet>();

    constructor(public rawHexString: string) {
        this.parseHeader();
        this.parseData();
    }

    getNextChars(num: number) {
        const numHexCharsToAdvance = Math.ceil(num / 4);
        const nextHexChars = this.rawHexString.substring(this.hexPos, this.hexPos + numHexCharsToAdvance);
        this.curWord += convertHexToBinary(nextHexChars);
        this.hexPos += numHexCharsToAdvance;
        // slice the next num chars from the current word
        const nextChars = this.curWord.substring(0, num);
        this.curWord = this.curWord.substring(num);
        this.binaryPos += num - 1;
        return nextChars;
    }

    parseHeader() {
        this.version = convertToBinary(this.getNextChars(3));
        this.type = convertToBinary(this.getNextChars(3));
    }
    
    parseData() {
        if (this.type === LITERAL) {
            this.parseLiteral();
        }
    }

    parseLiteral() {
        let isLastGroup;
        let literalString = "";
        do {
            isLastGroup = this.getNextChars(1) === "0";
            literalString += `${this.getNextChars(4)}`;
        } while (!isLastGroup);
        this.literal = parseInt(literalString, 2);
    }

    parseSubPackets() {

    }
}

function testParser() {
    const test1 = new Packet("D2FE28");
    if (test1.version !== 6) {
        throw new Error("Version parse incorrect");
    }
    if (test1.type !== LITERAL) {
        throw new Error("Type parse incorrect");
    }
    if (test1.literal !== 2021) {
        throw new Error("Literal parse incorrect");
    }
}

testParser();
console.log("Parser is ready!");