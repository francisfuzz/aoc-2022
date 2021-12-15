import * as fs from "fs";

class Point {
    constructor(public x: number, public y: number, public risk: number) {
    }

    getRightGrid(grid: Grid): Grid | undefined {
        if (this.x >= grid.width - 1) {
            return undefined;
        }

        const points = new Array<Array<Point>>();
        for (let y = this.y; y < grid.height; y++) {
            const row = new Array<Point>();
            for (let x = this.x + 1; x < grid.width; x++) {
                row.push(grid.points[y][x]);
            }
            points.push(row);
        }
        return new Grid(points);
    }

    getDownGrid(grid: Grid): Grid | undefined {
        if (this.y >= grid.height - 1) {
            return undefined;
        }

        const points = new Array<Array<Point>>();
        for (let y = this.y + 1; y < grid.height; y++) {
            const row = new Array<Point>();
            for (let x = this.x; x < grid.width; x++) {
                row.push(grid.points[y][x]);
            }
            points.push(row.map(r => r));
        }
        return new Grid(points);
    }
}

class Grid {
    public width: number;
    public height: number;
    
    constructor(public points: Array<Array<Point>>) {
        this.width = this.points[0].length;
        this.height = this.points.length;
    }

    print() {
        for (let y = 0; y < this.height; y++) {
            console.log(this.points[y].map(p => p.risk).join(""));
        }
        console.log(`[Score: ${this.score}]`);
        console.log(""); 
    }

    get score() {
        // add the risk of all the points
        return this.points.reduce((sum, row) => sum + row.reduce((sum, p) => sum + p.risk, 0), 0);   
    }

    get risk() {
        return this.points[0][0].risk;
    }

    navigateLeastRiskGrid(): number {
        console.log("Navigate THIS:");
        console.log(this.print());
        let rightGrid = this.points[0][0].getRightGrid(this);
        const downGrid = this.points[0][0].getDownGrid(this);

        if (rightGrid && downGrid) {
            if (rightGrid.score < downGrid.score) {
                console.log("Go right");
                return this.risk + rightGrid.navigateLeastRiskGrid();
            } else {
                console.log("Go down");
                return this.risk + downGrid.navigateLeastRiskGrid();
            }
        }
        if (rightGrid && !downGrid) {
            console.log("Go right");
            rightGrid.print();
            return this.risk + rightGrid.navigateLeastRiskGrid();
        }
        if (downGrid && !rightGrid) {
            console.log("Gown");
            downGrid.print();
            return this.risk + downGrid.navigateLeastRiskGrid();
        }
        console.log("end");
        return 0;
    }
}

const input = fs.readFileSync('inputs/input15-test2.txt', 'utf8').split('\n').map(line => line.split('').map(Number));

const inputPoints = new Array<Array<Point>>();
for (let y = 0; y < input.length; y++) {
    const row = new Array<Point>();
    for (let x = 0; x < input[0].length; x++) {
        row.push(new Point(x, y, input[y][x]));
    }
    inputPoints.push(row);
}

const grid = new Grid(inputPoints);
grid.print();

function testRight() {
    console.log("Check rightGrid");
    console.log("0,0:");
    grid.points[0][0].getRightGrid(grid)?.print();

    console.log("0,1:");
    grid.points[0][1].getRightGrid(grid)?.print();

    console.log("0,2:");
    grid.points[0][2].getRightGrid(grid)?.print();

    console.log("1,0:");
    grid.points[1][0].getRightGrid(grid)?.print();

    console.log("2,0:");
    grid.points[2][0].getRightGrid(grid)?.print();
}

function testDown() {
    console.log("Check downGrid");
    console.log("0,0:");
    grid.points[0][0].getDownGrid(grid)?.print();

    console.log("1,0:");
    grid.points[1][0].getDownGrid(grid)?.print();

    console.log("2,0:");
    grid.points[2][0].getDownGrid(grid)?.print();

    console.log("0,1:");
    grid.points[0][1].getDownGrid(grid)?.print();

    console.log("0,2:");
    grid.points[0][2].getDownGrid(grid)?.print();

    console.log("1,1:");
    grid.points[1][1].getDownGrid(grid)?.print();
}

// testRight();
// testDown();

const score = grid.navigateLeastRiskGrid();
console.log(`Least risk score: ${score}`);
