// Setup.
import {readFileSync} from "fs"
const contents = readFileSync("inputs/input7.txt", "utf8")

// Solution sourced from https://github.com/williammartin/aoc2022-ts/blob/main/src/day07/index.ts
// License: ISC via https://github.com/williammartin/aoc2022-ts/blob/b36376c9e9fff93fa989b32344af537a89ce62b0/package.json#L16
// cc: https://opensource.org/licenses/ISC

// Structured Line Types
type ChangeDirectory = { _t: "cd", to: string }
type List = { _t: "ls" }
type Directory = { _t: "directory", name: string }
type File = { _t: "file", name: string, size: number }

type Line = ChangeDirectory | List | Directory | File

// Structured Line Constructors and Match
const cd = (to: string): ChangeDirectory => ({ _t: "cd", to })
const ls = (): List => ({ _t: "ls" })
const dir = (name: string): Directory => ({ _t: "directory", name })
const file = (name: string, size: number): File => ({ _t: "file", name, size })

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

const isDir = (node: FSNode): node is FSDir => node._t == "fs-dir"

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
