import * as fs from 'fs';

// read in test data
const data = fs.readFileSync(`inputs/input6.txt`, 'utf8').split(',').map(Number);

const totalDays = 80;

class LanternFish {
  constructor(public dayBorn: number, public timer: number) {
  }

  getSelfAndChildCount() {
    let spawnDay = this.timer + this.dayBorn;
    let children = 0;

    while (spawnDay < totalDays) {
      let child = new LanternFish(spawnDay + 1, 8);
      
      let childCount = child.getSelfAndChildCount();
      children += childCount;
      spawnDay += 7;
    }
    
    return children + 1;
  }
}

// create an array of LanternFish objects from the data array
const lanternFish = data.map((num) => new LanternFish(0, num));

// const t1 = lanternFish[0].getSelfAndChildCount();
// const t2 = lanternFish[1].getSelfAndChildCount();
// const t3 = lanternFish[2].getSelfAndChildCount();
// const t4 = lanternFish[3].getSelfAndChildCount();
// const t5 = lanternFish[4].getSelfAndChildCount();

// console.log(`t1: ${t1}`);
// console.log(`t2: ${t2}`);
// console.log(`t3: ${t3}`);
// console.log(`t4: ${t4}`);
// console.log(`t5: ${t5}`);

const total = lanternFish.reduce((acc, fish) => acc + fish.getSelfAndChildCount(), 0);

console.log("Done!");
console.log(`Total on day ${totalDays}: ${total}`);