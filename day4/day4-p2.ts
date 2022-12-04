// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input4.txt", "utf8");
const data: Array<string> = contents.split("\n");

// Part 2 Prompt
// In how many assignment pairs do the ranges overlap?

// Determines if `n` is inclusively between the minimum bound and maximum bound specified.
function isWithin (n: number, minBound: number, maxBound: number): boolean {
  return n >= minBound && n <= maxBound
}

// Create a variable to store the number of containment pairs.
let containmentPairs = 0;

// Iterate through each of the section assignment pairs.
data.forEach((sectionAssignmentPair: string) => {
  // Split the section assignments.
  const [first, second] = sectionAssignmentPair.split(',');

  // Parse the numbers in each assignment.
  const [a1, a2] = first.split('-').map(i => parseInt(i));
  const [b1, b2] = second.split('-').map(i => parseInt(i));

  // Only add the containment pair if either end of the section assignment
  // bounds are within the other pair range.
  if (
    isWithin(a1, b1, b2) ||
    isWithin(a2, b1, b2) ||
    isWithin(b1, a1, a2) ||
    isWithin(b2, a1, a2)
  ) {
      containmentPairs += 1;
    }
})

console.log(containmentPairs);
