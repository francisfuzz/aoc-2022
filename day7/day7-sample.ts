// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input7-sample.txt", "utf8");
const data: string[] = contents.split("\n");

type Directory = {
  [name: string]: {
    parent: string,
    totalSize: number,
    subdirectories: Array<string>
  }
};

const fileSystem: Directory = {
  "/": {
    parent: "",
    totalSize: 0,
    subdirectories: [],
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
      // Update the file system representation with this new directory.
      fileSystem[b] = {
        parent: cwd,
        totalSize: 0,
        subdirectories: [],
      };

      // Append this new directory to the current working directory.
      fileSystem[cwd].subdirectories.push(b)

      console.log(`added directory ${b} to ${cwd}`);
    } else {
      // Update the current working directory's file weight.
      fileSystem[cwd].totalSize += parseInt(a);
      console.log(`The total size of ${cwd} is now ${fileSystem[cwd].totalSize}`);
    }
  }
})

// At this point, the representation is correct.
console.log(fileSystem);

// @todo: write a recursive function that updates the total sizes based on the subdirectories, if any.
