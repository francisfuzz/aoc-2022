import * as fs from 'fs';

class Point {
    constructor(public x: number, public y: number) {
    }

    get height(): number {
        return Grid.gridValues[this.y][this.x];
    }

    get isLowPoint(): boolean {
        // return true is this point height is lower than all adjacent points
        return this.adjacentPoints.every(p => this.height < p.height);
    }

    get adjacentPoints(): Point[] {
        // return points adjacent to this one
        const points: Point[] = [];
        for (let x = Math.max(0, this.x - 1); x <= Math.min(this.x + 1, Grid.maxWidth - 1); x++) {
            if (x !== this.x) points.push(new Point(x, this.y));
        }
        for (let y = Math.max(0, this.y - 1); y <= Math.min(this.y + 1, Grid.maxHeight - 1); y++) {
            if (y !== this.y) points.push(new Point(this.x, y));
        }
        return points;
    }
}

class Grid {
    public static maxWidth: number;
    public static maxHeight: number;
    public static gridValues: number[][];

    public static gridPoints = new Array<Point>();
    
    constructor(public grid: number[][]) {
        Grid.maxWidth = this.grid[0].length;
        Grid.maxHeight = this.grid.length;
        Grid.gridValues = this.grid;
        for (let x = 0; x < Grid.maxWidth; x++) {
            for (let y = 0; y < Grid.maxHeight; y++) {
                Grid.gridPoints.push(new Point(x, y));
            }
        }
    }

    getLowPoints() {
        return Grid.gridPoints.filter(p => p.isLowPoint);
    }

    getBasins() {
        const basins = new Array<Point[]>();
        const lowPoints = this.getLowPoints();
        lowPoints.forEach(lowPoint => {
            const basin = new Array<Point>();
            basin.push(lowPoint);
            const higherPoints = this.getHigherAdjacentPoints(lowPoint);
            const uniquePoints = new Array<Point>();
            higherPoints.forEach(p => {
                if (!uniquePoints.some(u => u.x === p.x && u.y === p.y)) uniquePoints.push(p);
            });
            basin.push(...uniquePoints);
            basins.push(basin);
        });
        return basins;
    }

    getHigherAdjacentPoints(me: Point) : Point[] {
        const adjacentPoints = me.adjacentPoints;
        const higherPoints = adjacentPoints.filter(p => p.height > me.height && p.height !== 9);
        higherPoints.push(...higherPoints.map(p => this.getHigherAdjacentPoints(p)).flat());
        return higherPoints;
    }
}

// read input file and split each line into an array of numbers
const input = fs.readFileSync('inputs/input9.txt', 'utf8').split('\n').map(line => line.split('').map(Number));
const grid = new Grid(input);
const riskSum = grid.getLowPoints().reduce((acc, point) => acc = acc + point.height + 1, 0);
console.log(`Risk sum is ${riskSum}`);

const basins = grid.getBasins();
const sizes = basins.map(b => b.length).sort((a, b) => b - a);
console.log(`There are ${basins.length} basins`);
console.log(`Largest basin is ${sizes[0]}`);
console.log(`Smallest basin is ${sizes[sizes.length - 1]}`);
console.log(`Result is ${sizes[0] * sizes[1] * sizes[2]}`);