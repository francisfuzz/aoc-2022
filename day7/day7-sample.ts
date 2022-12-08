// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input7-sample.txt", "utf8");
const data: string[] = contents.split("\n");

type Directory = {
  [name: string]: {
    parent: string,
    fileWeight: number,
    subdirectoryWeight: number,
  }
};

const fileSystem: Directory = {
  "/": {
    parent: "",
    fileWeight: 0,
    subdirectoryWeight: 0,
  }
};

// `cwd` represents the current working directory
let cwd: string;

// Build a representation of the file system.
data.forEach((line: string) => {
  // Any line starting with `$` is a command.
  if (line[0] === '$') {
    // Parse for the command name.
    const command = line.slice(2, 4);
    // Update the current working directory.
    if (command === 'cd') {
      const target = line.slice(5);

      if (target === '..') {
        // We're going "up": set it to the parent if non-null; else, set to the outmost directory.
        cwd = fileSystem[cwd].parent || '/';
      } else {
        // Set the current working directory to the specified target directory.
        cwd = target;
      }

      console.log(`cwd is now: ${cwd}`);
    } else if (command === 'ls') {
      console.log(`${command}: listing files of ${cwd}`);
    } else {
      console.log(`${command}: no-op, this isn't supported`);
    }
  } else {
    // This is either a directory or a file.
    const [a, b] = line.split(' ');
    if (a === 'dir') {
      // Update the filesystem with the new directory.
      fileSystem[b] = {
        parent: cwd,
        fileWeight: 0,
        subdirectoryWeight: 0,
      };
      console.log(`added directory ${b} to ${cwd}`);
    } else {
      // Update the current working directory's file weight.
      fileSystem[cwd].fileWeight += parseInt(a);
      console.log(`fileWeight of ${cwd} is now ${fileSystem[cwd].fileWeight}`);
    }
  }
})

console.log(fileSystem);

// Calculate the subdirectory weights
Object.keys(fileSystem).forEach(dirName => {
  const _p = fileSystem[dirName].parent;
  if (_p !== "") {
    fileSystem[_p].subdirectoryWeight += fileSystem[dirName].fileWeight;
  }
})

// Calculate the sum of relevant total sizes
const sumOfRelevantTotalSizes = Object.keys(fileSystem).map(dirName => {
  const curr = fileSystem[dirName];

  const totalWeight = curr.fileWeight + curr.subdirectoryWeight;

  return (totalWeight <= 100000) ? totalWeight : 0;
}).reduce((p: number, c: number) => {
  return p + c;
}, 0);

console.log(sumOfRelevantTotalSizes);
