import * as fs from "fs";

// read in a file
const input = fs.readFileSync("inputs/input5.txt", "utf8");

// make a class called VentLine with a constructor that takes in a string
// split the string by '->'
// split the the first element by comma to create a 2 element array of numbers called start
// split the the second element by comma to create a 2 element array of numbers called end
// create a method called getLine that produces an array of numbers from start to end
class Point {
    public x: number;
    public y: number;

    constructor(pointStr: string);
    constructor(x: number, y: number);

    constructor(...args: any[]) {
        if (args.length === 1) {
            const [pointStr] = args;
            const [x, y] = pointStr.split(",").map(Number);
            this.x = x;
            this.y = y;
        } else {
            const [x, y] = args;
            this.x = x;
            this.y = y;
        }
    }
}

class VentLine {
    public start: Point;
    public end: Point;

    get diffX(): number {
        return Math.abs(this.start.x - this.end.x);
    }

    get diffY(): number {
        return Math.abs(this.start.y - this.end.y);
    }

    get isHorizontal(): boolean {
        // return true if the first element of start and end are the same
        return this.start.x === this.end.x;
    }

    get isVertical(): boolean {
        // return true if the second element of start and end are the same
        return this.start.y === this.end.y;
    }

    get topLeft(): Point {
        return new Point(Math.min(this.start.x, this.end.x), Math.min(this.start.y, this.end.y));
    }

    get bottomRight(): Point {
        return new Point(Math.max(this.start.x, this.end.x), Math.max(this.start.y, this.end.y));
    }

    constructor(line: string) {
        const [start, end] = line.split("->");
        this.start = new Point(start);
        this.end = new Point(end);
    }

    getLine(): Point[] {
        const points = <Point[]>[];
        if (this.isHorizontal) {
            for (let i = Math.min(this.start.y, this.end.y); i <= Math.max(this.start.y, this.end.y); i++) {
                points.push(new Point(this.start.x, i));
            }
        }
        else if (this.isVertical) {
            for (let i = Math.min(this.start.x, this.end.x); i <= Math.max(this.start.x, this.end.x); i++) {
                points.push(new Point(i, this.start.y));
            }
        }
        else {
            let xAdd = this.start.x < this.end.x ? 1 : -1;
            let yAdd = this.start.y < this.end.y ? 1 : -1;
            for (let i = 0; i <= this.diffX; i++) {
                points.push(new Point(this.start.x + xAdd * i, this.start.y + yAdd * i));
            }
        }
        return points;
    }
}

// split contents by newline and create a new VentLine for each line
const lines = input.split("\n").map(line => new VentLine(line));

// work out the top left and bottom right points
const topLeft = lines.reduce((acc, line) => {
    return new Point(Math.min(acc.x, line.topLeft.x), Math.min(acc.y, line.topLeft.y));
}, new Point(Infinity, Infinity));

const bottomRight = lines.reduce((acc, line) => {
    return new Point(Math.max(acc.x, line.bottomRight.x), Math.max(acc.y, line.bottomRight.y));
}, new Point(-Infinity, -Infinity));

// create a grid from 0, 0 to bottom right with a 0 in each element
const grid = new Array(Math.max(bottomRight.y, topLeft.y) + 1).fill(0).map(() => new Array(Math.max(bottomRight.x, topLeft.x) + 1).fill(0));

// for each VentLine, add 1 to each point in the grid corresponding to the x,y coordinates of the point
lines.forEach(line => {
    line.getLine().forEach(point => {
        grid[point.y][point.x]++;
    });
});

// grid.forEach((row, i) => {
//     console.log(`${i}: ${row.map(point => point === 0 ? "." : point).join("")}`);
// });

// count all the points in the grid that have a value of 2 or more
const dangerPointCount = grid.reduce((acc, row) => {
    return acc + row.filter(point => point > 1).length;
}, 0);

console.log(`Danger point count: ${dangerPointCount}`);