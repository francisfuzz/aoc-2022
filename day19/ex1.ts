import * as fs from 'fs';

class Point {
    x: number;
    y: number;
    z: number;

    constructor(pointString: string);
    constructor(x: number, y: number, z: number);
    
    constructor(...args: any[]) {
        if (args.length === 1) {
            const pointString = args[0];
            const parts = pointString.split(",");
            this.x = parseInt(parts[0]);
            this.y = parseInt(parts[1]);
            this.z = parseInt(parts[2]);
        } else {
            this.x = args[0];
            this.y = args[1];
            this.z = args[2];
        }
    }

    face(direction: number) {
        switch (direction) {
            case 0:
                return this;
            case 1:
                return new Point(this.x, -this.y, -this.z);
            case 2:
                return new Point(this.x, -this.z, this.y);
            case 3:
                return new Point(-this.y, -this.z, this.x);
            case 4:
                return new Point(this.y, -this.z, -this.x);
            case 5:
                return new Point(-this.x, -this.z, -this.y);
            default:
                throw new Error("Invalid direction");
        }
    }

    rotate(rotation: number) {
        switch (rotation) {
            case 0:
                return this;
            case 1:
                return new Point(-this.y, this.x, this.z);
            case 2:
                return new Point(-this.x, -this.y, this.z);
            case 3:
                return new Point(this.y, -this.x, this.z);
            default:
                throw new Error("Invalid rotation");
        }
    }

    plus(other: Point) {
        return new Point(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    minus(other: Point) {
        return new Point(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y && this.z === other.z;
    }

    manhattan(other: Point) {
        return Math.abs(this.x) + Math.abs(other.x) + Math.abs(this.y) + Math.abs(other.y) + Math.abs(this.z) + Math.abs(other.z);
    }
}

function findIntersections(left: Point[], right: Point[]) {
    for (let direction = 0; direction < 6; direction++) {
        for (let rotation = 0; rotation < 4; rotation++) {
            const rightOriented = right.map(p => p.face(direction).rotate(rotation));
            for (let li = 0; li < left.length; li++) {
                const leftPoint = left[li];
                for (let ri = 0; ri < rightOriented.length; ri++) {
                    const rightPoint = rightOriented[ri];
                    const offset = leftPoint.minus(rightPoint);
                    const movedSet = rightOriented.map(p => p.plus(offset));
                    
                    const commonCount = movedSet.filter(p => left.some(l => l.equals(p))).length;
                    //console.log(`${direction} / ${rotation} -> ${commonCount}`);
                    if (commonCount >= 12) {
                        return new Cube(offset, movedSet);
                    }
                }
            }
        }
    }
    return undefined;
}

class Cube {
    constructor(public scanner: Point, public beacons: Point[]) {       
    }
}

class ScanReport {
    name: string;
    points: Point[];

    constructor(scan: string[]) {
        this.name = scan[0];
        this.points = scan.slice(1).map(p => new Point(p));
    }
}

function constructMap(reports: ScanReport[]) {
    const scanner0 = reports[0];
    const detectedScanners: Point[] = [];
    let unmappedReports = reports.slice(1);
    while(unmappedReports.length > 0) {
        const report = unmappedReports.shift()!;
        const intersection = findIntersections(scanner0.points, report.points);
        if (intersection) {
            scanner0.points.push(...intersection.beacons);
            detectedScanners.push(intersection.scanner);
            console.log(`Mapped ${report.name}`);
        } else {
            unmappedReports = [...unmappedReports, report];
        }
    }

    const uniquePoints: Point[] = [];
    scanner0.points.forEach(p => {
        if (!uniquePoints.some(d => d.equals(p))) {
            uniquePoints.push(p);
        }
    });
    scanner0.points = uniquePoints;

    return [detectedScanners, scanner0];
}

const inputReports = fs.readFileSync("inputs/input19.txt", "utf8").split("\n\n");
const reports = inputReports.map(r => new ScanReport(r.split("\n")));
const [_, scanner0] = constructMap(reports);
let pointSet = new Set((<ScanReport>scanner0).points);
console.log(pointSet.size);