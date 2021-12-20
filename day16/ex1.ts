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
const SUM = 0;
const PROD = 1;
const MIN = 2;
const MAX = 3;
const LITERAL = 4;
const GT = 5;
const LT = 6;
const EQ = 7;

class Packet {
    // literal property
    public literal = 0;

    // operator properties
    public lengthTypeID = "";
    public operatorChildPackets = new Array<Packet>();
    public subPacketStringLength = 0;
    public numSubPackets = 0;

    constructor(public parser: Parser, public version: number, public type: number) {
        if (this.type === LITERAL) {
            this.literal = this.parseLiteralFromHex();
        } else {
            this.parseOperator();
        }
    }

    parseLiteralFromHex() {
        let isLastGroup;
        let literalString = "";
        do {
            isLastGroup = this.parser.getNextChars(1) === "0";
            literalString += `${this.parser.getNextChars(4)}`;
        } while (!isLastGroup);
        return parseInt(literalString, 2);
    }

    parseOperator() {
        this.lengthTypeID = this.parser.getNextChars(1);
        if (this.lengthTypeID === "0") {
            const bitLengthChars = this.parser.getNextChars(15);
            this.subPacketStringLength = parseInt(bitLengthChars, 2);
            const targetPos = this.parser.binaryPos + this.subPacketStringLength;
            while(this.parser.binaryPos < targetPos) {
                this.operatorChildPackets.push(this.parser.parseNextPacket());
            }
        } else {
            const subPacketCountChars = this.parser.getNextChars(11);
            this.numSubPackets = parseInt(subPacketCountChars, 2);
            for(let i = 0; i < this.numSubPackets; i++) {
                this.operatorChildPackets.push(this.parser.parseNextPacket());
            }
        }
    }

    sumVersions(): number {
        return this.operatorChildPackets.reduce((acc, curr) => acc + curr.sumVersions(), this.version);
    }

    calcValue(): number {
        if (this.type === LITERAL) {
            return this.literal;
        } else {
            switch(this.type) {
                case SUM:
                    return this.operatorChildPackets.reduce((acc, curr) => acc + curr.calcValue(), 0);
                case PROD:
                    return this.operatorChildPackets.reduce((acc, curr) => acc * curr.calcValue(), 1);
                case MIN:
                    return this.operatorChildPackets.reduce((acc, curr) => Math.min(acc, curr.calcValue()), Number.MAX_SAFE_INTEGER);
                case MAX:
                    return this.operatorChildPackets.reduce((acc, curr) => Math.max(acc, curr.calcValue()), Number.MIN_SAFE_INTEGER);
                case LT:
                    return this.operatorChildPackets[0].calcValue() < this.operatorChildPackets[1].calcValue() ? 1 : 0;
                case GT:
                    return this.operatorChildPackets[0].calcValue() > this.operatorChildPackets[1].calcValue() ? 1 : 0;
                case EQ:
                    return this.operatorChildPackets[0].calcValue() === this.operatorChildPackets[1].calcValue() ? 1 : 0;
                default:
                    throw new Error(`Unknown operator type ${this.type}`);
            }
        }
    }
}

class Parser {
    hexPos = 0;
    binaryPos = 0;
    curWord = "";

    constructor(public rawHexString: string) {
    }

    getNextChars(num: number) {
        const numHexCharsToAdvance = Math.ceil(num / 4);
        const nextHexChars = this.rawHexString.substring(this.hexPos, this.hexPos + numHexCharsToAdvance);
        this.curWord += convertHexToBinary(nextHexChars);
        this.hexPos += numHexCharsToAdvance;
        // slice the next num chars from the current word
        const nextChars = this.curWord.substring(0, num);
        this.curWord = this.curWord.substring(num);
        this.binaryPos += num;
        return nextChars;
    }

    parseNextPacket() {
        const version = convertToBinary(this.getNextChars(3));
        const type = convertToBinary(this.getNextChars(3));
        return new Packet(this, version, type);
    }
}

function testParserLiteral() {
    console.log("Testing D2FE28");
    const parser = new Parser("D2FE28");
    const literal = parser.parseNextPacket();

    if (literal.version !== 6) {
        throw new Error("Version parse incorrect");
    }
    if (literal.type !== LITERAL) {
        throw new Error("Type parse incorrect");
    }
    if (literal.literal !== 2021) {
        throw new Error("Literal parse incorrect");
    }
    console.log("Passed!");
}

function testParserOperator() {
    console.log("Testing 38006F45291200");
    const parser = new Parser("38006F45291200");
    const operator = parser.parseNextPacket();

    if (operator.version !== 1) {
        throw new Error("Version parse incorrect");
    }
    if (operator.type === LITERAL) {
        throw new Error("Type parse incorrect");
    }
    if (operator.lengthTypeID !== "0") {
        throw new Error("Length type indicator is incorrect");
    }
    if (operator.subPacketStringLength !== 27) {
        throw new Error("subPacketStringLength is incorrect");
    }
    if (operator.operatorChildPackets.length !== 2) {
        throw new Error("operatorChildPackets.length is incorrect");
    }
    if (operator.operatorChildPackets[0].literal !== 10) {
        throw new Error("operatorChildPackets[0].literal is incorrect");
    }
    if (operator.operatorChildPackets[1].literal !== 20) {
        throw new Error("operatorChildPackets[1].literal is incorrect");
    }
    console.log("Pass!");

    console.log("Testing EE00D40C823060");
    const parser2 = new Parser("EE00D40C823060");
    const operator2 = parser2.parseNextPacket();

    if (operator2.version !== 7) {
        throw new Error("Version parse incorrect");
    }
    if (operator2.type === LITERAL) {
        throw new Error("Type parse incorrect");
    }
    if (operator2.lengthTypeID !== "1") {
        throw new Error("Length type indicator is incorrect");
    }
    if (operator2.numSubPackets !== 3) {
        throw new Error("subPacketStringLength is incorrect");
    }
    if (operator2.operatorChildPackets.length !== 3) {
        throw new Error("operatorChildPackets.length is incorrect");
    }
    if (operator2.operatorChildPackets[0].literal !== 1) {
        throw new Error("operatorChildPackets[0].literal is incorrect");
    }
    if (operator2.operatorChildPackets[1].literal !== 2) {
        throw new Error("operatorChildPackets[1].literal is incorrect");
    }
    if (operator2.operatorChildPackets[2].literal !== 3) {
        throw new Error("operatorChildPackets[2].literal is incorrect");
    }
    console.log("Pass!");
}

function testVersionSum(hex: string, expected: number) {
    const parser = new Parser(hex);
    const packet = parser.parseNextPacket();
    const sum = packet.sumVersions();
    if (sum !== expected) {
        throw new Error(`${hex}: Expected ${expected}, got ${sum}`);
    } else {
        console.log(`${hex}: Sum test passed!`);
    }
}

function testValue(hex: string, expected: number) {
    const parser = new Parser(hex);
    const packet = parser.parseNextPacket();
    const sum = packet.calcValue();
    if (sum !== expected) {
        throw new Error(`${hex}: Expected ${expected}, got ${sum}`);
    } else {
        console.log(`${hex}: Val test passed!`);
    }
}

function testParser() {
    testParserLiteral();
    testParserOperator();
    testVersionSum("8A004A801A8002F478", 16);
    testVersionSum("620080001611562C8802118E34", 12);
    testVersionSum("C0015000016115A2E0802F182340", 23);
    testVersionSum("A0016C880162017C3686B18A3D4780", 31);

    testValue("C200B40A82", 3);
    testValue("04005AC33890", 54);
    testValue("880086C3E88112", 7);
    testValue("CE00C43D881120", 9);
    testValue("D8005AC2A8F0", 1);
    testValue("F600BC2D8F", 0);
    testValue("9C005AC2F8F0", 0);
    testValue("9C0141080250320F1802104A08", 1);

    console.log("Parser is ready!");
}

//testParser();

const input = fs.readFileSync('inputs/input16.txt', 'utf8');
const parser = new Parser(input);
const outerPacket = parser.parseNextPacket();
console.log(`Part 1: ${outerPacket.sumVersions()}`);
console.log(`Part 2: ${outerPacket.calcValue()}`);