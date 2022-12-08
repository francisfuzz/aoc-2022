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
// This may just be the silliest thing I write in the year 2022.
// Recursion FTW
function crawl (d: Directory, k: string): number {
  // Base case: give back the total size if there's no subdirectories to process.
  if (d[k].subdirectories.length === 0) {
    return d[k].totalSize;
  } else {
    // Recursive step: crawl through each of the subdirectories
    // And reduce it to the total sum of all of their sizes plus the total size.
    return d[k].subdirectories.map(sd => {
      return crawl(d, sd);
    }).reduce((p: number, c:number) => {
      return p + c;
    }, 0) + d[k].totalSize;
  }
}

// Update the total size with crawl
Object.keys(fileSystem).forEach(k => {
  fileSystem[k].totalSize = crawl(fileSystem, k);
})

const sumOfTotalSizes = Object.keys(fileSystem).map(k => {
  return (fileSystem[k].totalSize <= 100000) ? fileSystem[k].totalSize : 0
}).reduce((p: number, c:number) => {
  return p + c;
}, 0);

console.log(`The sum of the total sizes of directories at most 100000: ${sumOfTotalSizes}`);
