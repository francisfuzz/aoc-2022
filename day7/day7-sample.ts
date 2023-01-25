// Setup.
import {readFileSync} from "fs"
const contents = readFileSync("inputs/input7.txt", "utf8")

// Solution sourced from https://github.com/williammartin/aoc2022-ts/blob/main/src/day07/index.ts
// License: ISC via https://github.com/williammartin/aoc2022-ts/blob/b36376c9e9fff93fa989b32344af537a89ce62b0/package.json#L16
// cc: https://opensource.org/licenses/ISC

// [Q] At a high-level, how does the author think about how to scope each of the sections to rely on the type system for protection?

// Structured Line Types
type ChangeDirectory = { _t: "cd", to: string }
type List = { _t: "ls" }
type Directory = { _t: "directory", name: string }
type File = { _t: "file", name: string, size: number }

type Line = ChangeDirectory | List | Directory | File

// Structured Line Constructors and Match
// [Q] Is this way of assigning a variable a function definition the same as the following:
// `const cd = (to: string): ChangeDirectory => { return { _t: "cd", to } }`
const cd = (to: string): ChangeDirectory => ({ _t: "cd", to })
const ls = (): List => ({ _t: "ls" })
const dir = (name: string): Directory => ({ _t: "directory", name })
const file = (name: string, size: number): File => ({ _t: "file", name, size })

// [Q] How is the `<R>` type hole used here?
// In the `parseFS` function, we use the `matchLine` function to match on the `Line` type.
// Once the line's type (via `_t`) is matched, what's returned is its corresponding "callback"
// function.
const matchLine = <R>(line: Line, fns: {
  OnChangeDirectory: (cd: ChangeDirectory) => R,
  OnList: (list: List) => R,
  OnDirectory: (dir: Directory) => R,
  OnFile: (file: File) => R,
}): R => {
  switch (line._t) {
    case "cd":
      return fns.OnChangeDirectory(line)
    case "ls":
      return fns.OnList(line)
    case "directory":
      return fns.OnDirectory(line)
    case "file":
      return fns.OnFile(line)
  }
}

// Structured Line Parsing

const parseInput = (rawInput: string): Line[] =>
    rawInput.split("\n").map(toLine)

const toLine = (s: string): Line => {
    if (s.startsWith("$")) {
      return parseCommand(s)
    } else if (s.startsWith("dir")) {
      return parseDir(s)
    } else {
      return parseFile(s)
    }
}

const parseCommand = (s: string): ChangeDirectory | List => {
  const cmd = s.split(" ")
  if (cmd.length === 2) {
    return ls()
  } else {
    // [Q] What does the `_` mean here? Is it a way of signifying assigned variables that don't get used?
    const [_$, _cmd, to] = cmd
    return cd(to)
  }
}

const parseDir = (s: string): Directory => {
  const [_, name] = s.split(" ")
  return dir(name)
}

const parseFile = (s: string): File => {
  const [size, name] = s.split(" ")
  return file(name, Number(size))
}

// FileSystem Types

type FSFile = { _t: "fs-file", name: string, size: number }
type FSDir = { _t: "fs-dir", name: string, parent: FSDir | null, nodes: Map<String, FSNode> }

type FSNode = FSFile | FSDir

// FileSystem Constructors, Operators and Match
const fsFile = (name: string, size: number): FSFile => ({ _t: "fs-file", name, size })
const fsDir = (name: string, parent: FSDir | null = null): FSDir => ({ _t: "fs-dir", name, parent, nodes: new Map() })

// [Q] Why is weak equality used here?
// [Q] How does the `node is FSDir` work?
const isDir = (node: FSNode): node is FSDir => node._t == "fs-dir"

// This uses the same pattern as `matchLine` above.
// The callback functions aren't actually defined here,
// but sort of "passed off" into whatever is passed to the `matchFsNode` when it's called.
const matchFSNode = <R>(node: FSNode, fns: {
  OnFSFile: (file: FSFile) => R,
  OnFSDir: (dir: FSDir) => R,
}): R => {
    switch (node._t) {
      case "fs-file":
        return fns.OnFSFile(node)
      case "fs-dir":
        return fns.OnFSDir(node)
    }
  }

// Parsing lines into a filesystem
const parseFS = (lines: Line[]): FSDir => {
  const rootNode: FSDir = fsDir("/")
  let currentNode: FSDir = rootNode

  lines.forEach(line => {
    matchLine(line, {
      OnChangeDirectory: (cd) => {
        if (cd.to == "/") {
          currentNode = rootNode
        } else if (cd.to == "..") {
          if (currentNode.parent == null) {
            throw new Error("unexpected cd .. without a parent")
          }
          currentNode = currentNode.parent
        } else {
          const newDirNode = fsDir(cd.to, currentNode)
          currentNode.nodes.set(cd.to, newDirNode)
          currentNode = newDirNode
        }
      },
      OnList: (_) => {
        // continue because the list line has no valuable information
      },
      OnDirectory: (_) => {
        // continue because we lazily create directories on cd
      },
      OnFile: (file) => {
        currentNode.nodes.set(file.name, fsFile(file.name, file.size))
      },
    })
  })

  return rootNode
}

const allChildDirs = (dir: FSDir): FSDir[] => {  const dirs: FSDir[] = []
  dirs.push(dir)

  dir.nodes.forEach((node, _) => {
    if (isDir(node)) {
      dirs.push(...allChildDirs(node))
    }
  })
  return dirs
}

const sizeOf = (node: FSNode): number => { 
  return matchFSNode(node, {
    OnFSFile: (file) => file.size,
    OnFSDir: (dir) => Array.from(dir.nodes.values()).reduce((acc, curr) => acc + sizeOf(curr), 0),
  })
}

const sum = (a: number, b: number): number => a + b

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const fsRoot = parseFS(input)

  return allChildDirs(fsRoot) // get all the children of the root
    .concat(fsRoot) // and include the root
    .map(sizeOf) // map them to their directory sizes
    .filter(size => size < 100000) // keep only those below the threshold
    .reduce(sum, 0) // sum them up
}

const toMin = (a: number, b: number): number => a < b ? a : b

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const fsRoot = parseFS(input)

  const requiredSpace = 30000000 - (70000000 - sizeOf(fsRoot));

  return allChildDirs(fsRoot) // get all the children of the root
    .concat(fsRoot) // and include the root
    .map(sizeOf) // map them to their directory sizes
    .filter(size => size >= requiredSpace) // keep only those with enough space to delete
    .reduce(toMin, Infinity) // find the smallest
}

console.log(part1(contents));
console.log(part2(contents));
