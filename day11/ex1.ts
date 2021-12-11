import * as fs from "fs";

class Point {
    constructor(public x: number, public y: number) { }
}

class Octopus {
    public flashLevel = -1;
    
    constructor(public position: Point, public energy: number) {
    }

    get adjacentOctopi(): Octopus[] {
        // return octopi adjacent to this one
        const octopi: Octopus[] = [];
        for (let x = Math.max(0, this.position.x - 1); x <= Math.min(this.position.x + 1, Grid.maxWidth - 1); x++) {
            for (let y = Math.max(0, this.position.y - 1); y <= Math.min(this.position.y + 1, Grid.maxHeight - 1); y++) {
                if (x !== this.position.x || y !== this.position.y) {
                    const o = Grid.find(x, y);
                    if (o) octopi.push(o);
                }
            }
        }
        return octopi;
    }

    upEnergy(curLevel: number) {
        if (this.flashLevel !== curLevel) this.energy++;
    }

    flash(curLevel: number) {
        if (curLevel !== this.flashLevel) {
            // flash
            this.flashLevel = curLevel;
            this.energy = 0;
            Grid.flashes++;
            this.adjacentOctopi.forEach(o => o.upEnergy(curLevel));
            this.adjacentOctopi.filter(o => o.energy > 9).forEach(o => o.flash(curLevel));
        }
    }
}

class Grid {
    public static maxWidth: number;
    public static maxHeight: number;
    public static OctoMap: Map<Point, Octopus> = new Map();
    
    public static flashes = 0;
    
    constructor(public grid: number[][]) {
        Grid.maxWidth = this.grid[0].length;
        Grid.maxHeight = this.grid.length;
        for (let x = 0; x < Grid.maxWidth; x++) {
            for (let y = 0; y < Grid.maxHeight; y++) {
                const pos = new Point(x, y);
                Grid.OctoMap.set(pos, new Octopus(pos, this.grid[y][x]));
            }
        }
    }

    flashGrid(total: number) {
        for (let i = 0; i < total; i++) {
            // increase energy by 1
            Grid.OctoMap.forEach(o => o.energy++);
            [...Grid.OctoMap.values()].filter(o => o.energy > 9).forEach(o => o.flash(i));
            const levelFlashCount = [...Grid.OctoMap.values()].filter(o => o.flashLevel === i).length;
            console.log(`Level ${i + 1} (flashes this level is ${levelFlashCount}) - total is ${Grid.flashes}`);
            if (levelFlashCount === 100) break;
            //this.printGrid();
        }
    }

    static find(x: number, y: number) {
        const key = [...Grid.OctoMap.keys()].find(p => p.x === x && p.y === y);
        return key ? Grid.OctoMap.get(key) : undefined;
    }

    printGrid() {
        for (let y = 0; y < Grid.maxHeight; y++) {
            let row = "";
            for (let x = 0; x < Grid.maxWidth; x++) {
                row += Grid.find(x, y) ? Grid.find(x, y)?.energy : ".";
            }
            console.log(row);
        }
        console.log("");
    }
}

// read input from file, split by newline and map to number array
const input = fs.readFileSync("inputs/input11.txt", "utf8").split("\n").map(l => l.split('').map(Number));
const grid = new Grid(input);
console.log("Level 0");
grid.printGrid();
grid.flashGrid(1000);
grid.printGrid();
