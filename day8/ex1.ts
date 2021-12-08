import * as fs from "fs";

// normal
// n | seg.    | c | could be | shr with | !shr with | formula
// 0 | abcefg  | 6 | 0,6,9    | 7        | 4         | len==6, shr==7, !shr==4 
// 1 | cf      | 2 | 1
// 2 | acdeg   | 5 | 2,3,5    | 9*       | 1,9       | len==5, !shr==1, !shr==9
// 3 | acdfg   | 5 | 2,3,5    | 7                    | len==5, shr==1
// 4 | bcdf    | 4 | 4
// 5 | abdfg   | 5 | 2,3,5    | 9*       | 1.        | len==5, shr==9
// 6 | abdefg  | 6 | 0,6,9    |          | 7         | len==6, !shr==7
// 7 | acf     | 3 | 7         
// 8 | abcdefg | 7 | 8
// 9 | abcdfg  | 6 | 0,6,9    | 4,7      |           | len==6, shr==7, shr==4

// len6: if (!shr7 ? 6 : [shr4 ? 9 : 0])
// len5: if (shr7 ? 3 : [shr9 ? 5 : 2])

class Display {
    public numMap = new Map<number, string | undefined>();
    
    constructor(public segments: string[]) {
        this.segments = segments.map(s => s.split('').sort().join(''));
        this.initMap();
    }

    // function returns true if all chars in s are in t
    shared(s: string, t: string | undefined): boolean {
        if (t === undefined) { return false; }
        if (s.length >= t.length) return t.split('').every(c => s.includes(c));
        return s.split('').every(c => t.includes(c));
    }

    initMap() {
        // extrapolate 1,4,7,8
        this.numMap.set(1, this.segments.find(s => s.length === 2));
        this.numMap.set(4, this.segments.find(s => s.length === 4));
        this.numMap.set(7, this.segments.find(s => s.length === 3));
        this.numMap.set(8, this.segments.find(s => s.length === 7));

        // extrapolate 0,6,9 - must be done before len5 because we need to know what 9 is
        let len6s = this.segments.filter(s => s.length === 6);
        len6s.forEach(s => {
            let digit = !this.shared(s, this.numMap.get(7)) ? 6 : this.shared(s, this.numMap.get(4)) ? 9 : 0;
            this.numMap.set(digit, s);
        });

        if (this.numMap.size < 7) {
            throw new Error('Error with len6s');
        }

        // extrapolate 2,3,5
        let len5s = this.segments.filter(s => s.length === 5);
        len5s.forEach(s => {
            let digit = this.shared(s, this.numMap.get(7)) ? 3 : this.shared(s, this.numMap.get(9)) ? 5 : 2;
            this.numMap.set(digit, s);
        });

        if (this.numMap.size !== 10) {
            throw new Error('Error with len5s');
        }
    }

    decode(input: string) {
        // return the key where input (sorted) matches the value
        return Array.from(this.numMap.keys()).find(k => this.numMap.get(k) === input.split('').sort().join(''));
    }

    decodeAll(input: string[]) {
        return input.map(s => this.decode(s));
    }

    simpleCount(input: string[]) {
        return this.decodeAll(input).filter(i => i !== undefined && [1,4,7,8].indexOf(i) > -1).length;
    }

    decodeAllSingle(input: string[]) {
        let digits = this.decodeAll(input);
        return (1000 * (digits[0] ?? 0)) + (100 * (digits[1] ?? 0)) + (10 * (digits[2] ?? 0)) + (digits[3] ?? 0);
    }
}

// test
// const [segs, inputs] = "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe".split('|').map(s => s.trim().split(' '));
// const [segs, inputs] = "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe".split('|').map(s => s.trim().split(' '));
// const display = new Display(segs);

// inputs.forEach(i => console.log(`${i} = ${display.decode(i)}`));
// console.log(`simplecount = ${display.simpleCount(inputs)}`);

// ex 1:
// const lines = fs.readFileSync('inputs/input8.txt', 'utf8').split('\n');
// let simpleCount = 0;
// lines.forEach((l, i) => {
//     let [segs, inputs] = l.split('|').map(s => s.trim().split(' '));
//     const display = new Display(segs);
//     let sc = display.simpleCount(inputs);
//     console.log(`simplecount ${i} = ${sc}`);
//     simpleCount += sc;
// });
// console.log(`simplecount total = ${simpleCount}`);

// ex2:
const lines = fs.readFileSync('inputs/input8.txt', 'utf8').split('\n');
let total = 0;
lines.forEach((l, i) => {
    let [segs, inputs] = l.split('|').map(s => s.trim().split(' '));
    const display = new Display(segs);
    let t = display.decodeAllSingle(inputs);
    console.log(`total line ${i} = ${t}`);
    total += t;
});
console.log(`result = ${total}`);