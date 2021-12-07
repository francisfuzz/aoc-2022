import * as fs from 'fs';

// read in test data
const data = fs.readFileSync('test.txt', 'utf8').split(',n').map(Number);

