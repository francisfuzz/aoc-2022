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
    files: Array<File>,
    directories: {
      [subdirectoryName: string]: Directory,
    },
  }
};

const fileSystem: Directory = {
  '/': {
    files: [],
    directories: {},
  }
};

let currentWorkingDirectory = '/';

function update (d: Directory, target: string, output: string) {
  const [o1, o2] = output.split(' ');

  if (o1 === 'dir') {
    d[target].directories[o2] = {};
  } else {
    d[target].files.push({
      name: o2,
      size: parseInt(o1)
    });
  }
}


for (let i = 0; i < data.length; i++) {
  const line = data[i];

  if (line[0] === "$") {
    const command = line.slice(2, 4);

    if (command === 'cd') {
      const target = line.slice(5);
      if (target === '..') {
        // @todo: Go back up
      } else {
        currentWorkingDirectory = target;
      }
    }

    if (command === 'ls') {
      while (data[i+1][0] !== '$') {
        update(fileSystem, currentWorkingDirectory, data[i+1]);
        i++;
      }
    }
  }
}

console.log(fileSystem);
