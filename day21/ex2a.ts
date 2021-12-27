interface IScore {
    p1Wins: number,
    p2Wins: number
}

const CACHE = new Map<string, IScore>();
function countWins(p1Pos: number, p2Pos: number, p1Score: number, p2Score: number) {
    // "p1" never wins because we always switch players
    if (p2Score >= 21) {
        return <IScore>{ p1Wins: 0, p2Wins: 1 };
    }
    const key = `${p1Pos}-${p2Pos}-${p1Score}-${p2Score}`;
    const cached = CACHE.get(key);
    if (cached) {
        return cached;
    }
    const res = <IScore>{ p1Wins: 0, p2Wins: 0 };
    for (let d1 = 1; d1 <= 3; d1++) {
        for (let d2 = 1; d2 <= 3; d2++) {
            for (let d3 = 1; d3 <= 3; d3++) {
                const move = d1 + d2 + d3;
                const newPos = (p1Pos + move) % 10;
                const newScore = p1Score + (newPos === 0 ? 10 : newPos);
                
                // p2 becomes p1 for the next round
                const countsFromHere = countWins(p2Pos, newPos, p2Score, newScore);
                res.p1Wins += countsFromHere.p2Wins;
                res.p2Wins += countsFromHere.p1Wins;
            }
        }
    }
    CACHE.set(key, res);
    return res;
}

const startTime = Date.now();
const result = countWins(4, 5, 0, 0);
const endTime = Date.now();
console.log(`Elapsed time: ${endTime - startTime}ms`);
console.log(`${CACHE.size} cache entries`);
console.log(`Player 1 wins ${result.p1Wins} times, Player 2 wins ${result.p2Wins} times`);