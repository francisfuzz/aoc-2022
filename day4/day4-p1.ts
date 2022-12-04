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

// Iterate through each of the section assignment pairs.
const containmentPairs: number = data.reduce((accumulator: number, sectionAssignmentPair: string): number => {
  // Split the section assignments.
  const [first, second] = sectionAssignmentPair.split(',');

  // Parse the numbers in each assignment.
  const [a1, a2] = first.split('-').map(i => parseInt(i));
  const [b1, b2] = second.split('-').map(i => parseInt(i));

  // Only add the containment pair if either the section assignment is within one or the other.
  if ((isWithin(a1, b1, b2) && isWithin(a2, b1, b2)) || (isWithin(b1, a1, a2) && isWithin(b2, a1, a2))) {
    return accumulator + 1;
  } else {
    return accumulator;
  }
}, 0)

console.log(containmentPairs);
