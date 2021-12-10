import * as fs from "fs";

// read file and split by newline
const input = fs.readFileSync("inputs/input10.txt", "utf8").split("\n");

// create a stack with push, pop and peek methods
class ChunkLine {
  private static ChunkMap = new Map([
    [")", "("],
    ["}", "{"],
    ["]", "["],
    [">", "<"]    
  ]);

  private items: string[] = [];

  push(item: string) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isNextCharValid(c: string) {
    return ChunkLine.ChunkMap.get(c) === this.peek();
  }

  isOpenChunk(c: string) {
      return [...ChunkLine.ChunkMap.values()].includes(c);
  }

  isCloseChunk(c: string) {
      return [...ChunkLine.ChunkMap.keys()].includes(c);
  }
}

const errors: Map<number, string> = new Map();

input.forEach((line, i) => {
    const chunkLine = new ChunkLine();
    line.split("").forEach(c => {
        if (chunkLine.isOpenChunk(c)) {
            chunkLine.push(c);
        } else if (chunkLine.isCloseChunk(c)) {
            if (!chunkLine.isNextCharValid(c)) {
                if (!errors.has(i)) errors.set(i, c);
            } else {
                chunkLine.pop();
            }
        }
    });
});

const scoreMap = new Map([
    [")", 3],
    ["]", 57],
    ["}", 1197],
    [">", 25137],
]);

console.log(`Found ${errors.size} errors`);
let total = 0;
errors.forEach((v, k) => {
    total += scoreMap.get(v) ?? 0;
});
console.log(`Total score: ${total}`);