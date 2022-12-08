// Setup.
import {readFileSync} from "fs";
const contents = readFileSync("inputs/input7-sample.txt", "utf8");
const data: string[] = contents.split("\n");

type File = {
  name: string,
  size: number,
};

type Directory = {
  [name: string]: {
    parent: string | null,
    files: Array<File>,
  }
};

const fileSystem: Directory = {
  "/": {
    files: [],
    parent: null,
  }
};

let cwd: string;

data.forEach((line: string) => {
  if (line[0] === '$') {
    const command = line.slice(2, 4);
    if (command === 'cd') {
      const target = line.slice(5);

      if (target === '..') {
        cwd = fileSystem[cwd].parent || '/';
      } else {
        cwd = target;
      }

      console.log(`cwd is now: ${cwd}`);
    } else {
      console.log(`Got command: ${command}, listing files of ${cwd}`);
    }
  } else {
    // This is either a directory or a file.
    // Process it accordingly.
    const [a, b] = line.split(' ');
    if (a === 'dir') {
      const _b = b.slice();
      const _cwd = cwd.slice();
      fileSystem[_b] = {
        parent: _cwd,
        files: []
      };
      console.log(`added directory ${b} to ${cwd}`);
    } else {
      fileSystem[cwd].files.push({
        name: b,
        size: (parseInt(a) || 0),
      });
      console.log(`added file ${b} of size ${a} to ${cwd}`);
    }
  }
})

console.log(fileSystem);
