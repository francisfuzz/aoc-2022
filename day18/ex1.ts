function findCloseBraceIndex(input: string) {
    let closeCount = 1;
    let stop = false;
    let length = 1;
    while (!stop) {
        const nextChar = input[length++];
        if (nextChar === "[") {
            closeCount++;
        } else if (nextChar === "]") {
            closeCount--;
            if (closeCount === 0) {
                stop = true;
            }
        }
    }
    return length;
}

function parseNumberString(input: string) {
    if (input[0] === "[") {
        const length = findCloseBraceIndex(input);
        const left: any = parseNumberString(input.substring(1, length - 1));
        if (input.length > length && input[length] === ",") {
            const right: any = parseNumberString(input.substring(length + 1));
            return [left, right];
        } else {
            return left;
        }
    } else {
        // find the next comma
        let commaIndex = input.indexOf(",");
        if (commaIndex !== -1) {
            const leftNum = parseInt(input.substring(0, commaIndex));
            const rightNum: any = parseNumberString(input.substring(commaIndex + 1));
            return [leftNum, rightNum];
        } else {
            return parseInt(input);
        }
    }
}

class SnailFishNumber {
    public left: SnailFishNumber | number;
    public right: SnailFishNumber | number;

    get rightRegularNum(): number {
        if (this.right instanceof SnailFishNumber) {
            return this.right.leftRegularNum;
        } else {
            return this.right;
        }
    }

    get leftRegularNum(): number {
        if (this.left instanceof SnailFishNumber) {
            return this.left.rightRegularNum;
        } else {
            return this.left;
        }
    }

    constructor(numberArray: any, public parent?: SnailFishNumber) {
        const left = numberArray[0];
        const right = numberArray[1];

        if (left instanceof Array) {
            this.left = new SnailFishNumber(numberArray[0], this);
        } else {
            this.left = left;
        }
        if (right instanceof Array) {
            this.right = new SnailFishNumber(numberArray[1], this);
        } else {
            this.right = right;
        }
    }

    addRight(n: number) {
        if (this.right instanceof SnailFishNumber) {
            this.right.addLeft(n);
        } else {
            this.right += n;
        }
    }

    addLeft(n: number) {
        if (this.left instanceof SnailFishNumber) {
            this.left.addRight(n);
        } else {
            this.left += n;
        }
    }

    getNestedCount(): number {
        const leftDepth = this.left instanceof SnailFishNumber ? this.left.getNestedCount() + 1 : 0;
        const rightDepth = this.right instanceof SnailFishNumber ? this.right.getNestedCount() + 1 : 0;
        return Math.max(leftDepth, rightDepth);
    }

    get isSimplePair() {
        return !(this.left instanceof SnailFishNumber) && !(this.right instanceof SnailFishNumber);
    }

    toPairStack(stack?: SnailFishNumber[]): SnailFishNumber[] {
        if (!stack) {
            stack = [];
        }
        if (this.isSimplePair) {
            stack.push(this);
        }
        if (this.left instanceof SnailFishNumber) {
            this.left.toPairStack(stack);
        }
        if (this.right instanceof SnailFishNumber) {
            this.right.toPairStack(stack);
        }
        return stack;
    }

    findLeftMostNested(): SnailFishNumber | undefined {
        const stack = this.toPairStack();
        stack.reverse();
        while(stack.length > 0) {
            const top = stack.pop();
            if (top?.parent?.parent?.parent?.parent) {
                return top;
            }
        }
        return undefined;
    }

    getLeftNumberParent(): any {
        if (!this.parent) return undefined;
        if (this.parent!.left === this) {
            return this.parent!.getLeftNumberParent();
        } else {
            return this.parent;
        }
    }

    getRightNumberParent(): any {
        if (!this.parent) return undefined;
        if (this.parent!.right === this) {
            return this.parent!.getRightNumberParent();
        } else {
            return this.parent;
        }
    }

    explode() {
        if (this.getNestedCount() >= 4) {
            const numToExplode = this.findLeftMostNested()!;

            // explode the LHS
            const leftRegularNum = numToExplode.leftRegularNum;
            const rightRegularNum = numToExplode.rightRegularNum;

            const leftNumberParent = numToExplode.getLeftNumberParent();
            if (leftNumberParent) {
                if (leftNumberParent.left instanceof SnailFishNumber) {
                    leftNumberParent.left.addRight(leftRegularNum);
                } else {
                    leftNumberParent.addLeft(leftRegularNum);
                }
            }
            const rightNumberParent = numToExplode.getRightNumberParent();
            if (rightNumberParent) {
                if (rightNumberParent.right instanceof SnailFishNumber) {
                    rightNumberParent.right.addLeft(rightRegularNum);
                } else {
                    rightNumberParent.addRight(rightRegularNum);
                }
            }
            if (numToExplode.parent!.left === numToExplode) {
                numToExplode.parent!.left = 0;
            } else {
                numToExplode.parent!.right = 0;
            }
            return true;
        }
        return false;
    }

    split(): boolean {
        let didSplit = false;
        if (!(this.left instanceof SnailFishNumber)) {
            if (this.left >= 10) {
                const splitLeft = Math.floor(this.left / 2);
                const splitRight = Math.ceil(this.left / 2);
                this.left = new SnailFishNumber([splitLeft, splitRight], this);
                didSplit = true;
            }
        }
        if (!didSplit && this.left instanceof SnailFishNumber) {
            didSplit = (<SnailFishNumber>this.left).split();
        }

        if (!didSplit) {
            if (!(this.right instanceof SnailFishNumber)) {
                if (this.right >= 10) {
                    const splitLeft = Math.floor(this.right / 2);
                    const splitRight = Math.ceil(this.right / 2);
                    this.right = new SnailFishNumber([splitLeft, splitRight], this);
                    didSplit = true;
                }
            }

            if (!didSplit && this.right instanceof SnailFishNumber) {
                didSplit = (<SnailFishNumber>this.right).split();
            }
        } 
        return didSplit;        
    }

    reduce() {
        const didExplode = this.explode();
        if (didExplode) {
            this.split();
            this.reduce();
        } else {
            const didSplit = this.split();
            if (didSplit) {
                this.reduce();
            }
        }
    }

    add(addend: SnailFishNumber) {
        const newNum = new SnailFishNumber([this, addend]);
        (<SnailFishNumber>newNum.left).parent = newNum;
        (<SnailFishNumber>newNum.right).parent = newNum;

        newNum.reduce();
        return newNum;
    }

    toString() {
        let leftStr = "";
        if (this.left instanceof SnailFishNumber) {
            leftStr += this.left.toString();
        } else {
            leftStr = `${this.left}`;
        }

        let rightStr = "";
        if (this.right instanceof SnailFishNumber) {
            rightStr += this.right.toString();
        } else {
            rightStr += `${this.right}`;
        }

        return `[${leftStr},${rightStr}]`;
    }
}

// test
function testParse(input: string) {
    const x = new SnailFishNumber(parseNumberString(input));
    if (input !== x.toString()) {
        throw Error(`${input} !== ${x.toString()}`);
    }
}

function addNums(nums: string[]) {
    const fishNums = nums.map(x => new SnailFishNumber(parseNumberString(x)));
    // remove the first element
    const first = fishNums.shift()!;
    return fishNums.reduce((acc, cur) => acc.add(cur), first);
}

function testAdd(nums: string[], expected: string) {
    const x = addNums(nums);
    if (x.toString() !== expected) {
        throw new Error(`Add failed - expected ${expected} but got ${x.toString()}`);
    } else {
        console.log(`Add passed - got expected ${expected}`);
    }
}

function testExplode(input: string, expected: string) {
    const x = new SnailFishNumber(parseNumberString(input));
    x.reduce();
    if (x.toString() !== expected) {
        throw new Error(`Explode failed - expected ${expected} but got ${x.toString()}`);
    } else {
        console.log(`Explode passed - got expected ${expected}`);
    }
}

function testSplit(input: string, expected: string) {
    const x = new SnailFishNumber(parseNumberString(input));
    x.split();
    if (x.toString() !== expected) {
        throw new Error(`Split failed - expected ${expected} but got ${x.toString()}`);
    } else {
        console.log(`Split passed - got expected ${expected}`);
    }
}

function test() {
    // testParse("[1,2]");
    // testParse("[[1,2],3]");
    // testParse("[9,[8,7]]");
    // testParse("[[1,9],[8,5]]");
    // testParse("[2,[[[[[9,8],1],2],3],4]]");

    // testExplode("[[[[[9,8],1],2],3],4]", "[[[[0,9],2],3],4]");
    // testExplode("[7,[6,[5,[4,[3,2]]]]]", "[7,[6,[5,[7,0]]]]");
    // testExplode("[2,[[[[[7,6],1],2],3],4]]", "[9,[[[0,9],3],4]]");

    // testAdd(["[1,1]", "[2,2]", "[3,3]", "[4,4]"], "[[[[1,1],[2,2]],[3,3]],[4,4]]");
    // testAdd(["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]"], "[[[[3,0],[5,3]],[4,4]],[5,5]]");
    // testAdd(["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]", "[6,6]"], "[[[[5,0],[7,4]],[5,5]],[6,6]]");

    // testSplit("[[[[0,7],4],[15,[0,13]]],[1,1]]", "[[[[0,7],4],[[7,8],[0,13]]],[1,1]]");
    // testSplit("[[[[0,7],4],[[7,8],[0,13]]],[1,1]]", "[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]");

    // testAdd(["[[[[4,3],4],4],[7,[[8,4],9]]]", "[1,1]"], "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]");
    testAdd(["[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]","[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]"], "[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]");
}

test();

//const input = fs.readFileSync("input18-test.txt", "utf8").split("\n");