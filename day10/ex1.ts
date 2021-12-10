import * as fs from "fs";

// read file and split by newline
const input = fs.readFileSync("inputs/input10.txt", "utf8").split("\n");

// create a stack with push, pop and peek methods
class ChunkLine {
  private static OpenChunkMap = new Map([
    [")", "("],
    ["}", "{"],
    ["]", "["],
    [">", "<"]    
  ]);

  private static CloseChunkMap = new Map([
    ["(", ")"],
    ["{", "}"],
    ["[", "]"],
    ["<", ">"]    
  ]);

  private static CloseScores = new Map([
    [")", 1],
    ["]", 2],
    ["}", 3],
    [">", 4]
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
    return ChunkLine.OpenChunkMap.get(c) === this.peek();
  }

  isOpenChunk(c: string) {
      return [...ChunkLine.OpenChunkMap.values()].includes(c);
  }

  isCloseChunk(c: string) {
      return [...ChunkLine.OpenChunkMap.keys()].includes(c);
  }

  completeLine() {
      //console.log(`Open sequence: ${this.items.join("")}`);
      const closeSeq = this.items.reverse().map(c => ChunkLine.CloseChunkMap.get(c) ?? "");
      console.log(`Close sequence: ${closeSeq.join("")}`);
      return closeSeq;
  }

  scoreCompletion() {
    const close = this.completeLine();
    const total = close.reduce((total, c) => (total * 5) + (ChunkLine.CloseScores.get(c) ?? 0), 0);
    console.log(`Completion score: ${total}`);
    return total;
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

// discard the error lines from the input
const incompleteLines = input.filter((_, i) => !errors.has(i));
console.log(`Found ${incompleteLines.length} lines without errors`);

const scores: number[] = [];
incompleteLines.forEach(l => {
    const chunk = new ChunkLine();
    console.log("Line: ", l);
    l.split("").forEach(c => {
        if (chunk.isOpenChunk(c)) {
            chunk.push(c);
        } else {
            chunk.pop();
        }
    });
    scores.push(chunk.scoreCompletion());
});

// get the middle item from scores
scores.sort((a, b) => a - b);
const middle = Math.floor(scores.length / 2);
console.log(`Middle score: ${scores[middle]}`);