// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input4.txt", "utf8");
const data: Array<string> = contents.split("\n");

// Part 1 Prompt
// In how many assignment pairs does one range fully contain the other?

// Determines if `n` is inclusively between the minimum bound and maximum bound specified.
function isWithin (n: number, minBound: number, maxBound: number): boolean {
  return n >= minBound && n <= maxBound
}

let containmentPairs = 0;

// Think about `2-4,6-8` as an example
data.forEach((sectionAssignmentPair: string) => {
  // Split the section assignments.
  const [first, second] = sectionAssignmentPair.split(',');

  // Parse the numbers in each assignment.
  const [a1, a2] = first.split('-').map(i => parseInt(i));
  const [b1, b2] = second.split('-').map(i => parseInt(i));

  if ((isWithin(a1, b1, b2) && isWithin(a2, b1, b2)) || (isWithin(b1, a1, a2) && isWithin(b2, a1, a2))) {
      containmentPairs += 1;
    }
})

console.log(containmentPairs);
