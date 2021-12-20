// test
// const TARGETXMIN = 20;
// const TARGETXMAX = 30;
// const TARGETYMIN = -10;
// const TARGETYMAX = -5;
// const MIN_START_X = 6; // min to get to target area by 0

// real
const TARGETXMIN = 102;
const TARGETXMAX = 157;
const TARGETYMIN = -146;
const TARGETYMAX = -90;
const MIN_START_X = 14; // min to get to target area by 0

const MAXYTOTRY = 10000;
const MAXSTEPS = 1000;

let ans = 0;

for (let startDX = MIN_START_X; startDX <= TARGETXMAX; startDX++) {
    let highest = 0;
    for (let startDY = 5; startDY <= MAXYTOTRY; startDY++) {
        let dx = startDX;
        let dy = startDY;
        let x = 0;
        let y = 0;
        let highest = 0;
        //console.log(`${startDX}, ${startDY}`);
        for (let steps = 0; steps < MAXSTEPS; steps++) {
            x += dx;
            y += dy;
            if (dx > 0) dx--;
            dy--;
            highest = Math.max(highest, y);
            if (x >= TARGETXMIN && x <= TARGETXMAX && y >= TARGETYMIN && y <= TARGETYMAX) {
                console.log(`Hit! ${startDX}, ${startDY}`);
                ans = Math.max(ans, highest);
            }
            if (x > TARGETXMAX && y < TARGETYMIN ||
                (dx === 0 && x < TARGETXMIN && y < TARGETYMIN)) {
                break;
            }
        }
    }
}
console.log(ans);