import { Grid } from './grid';

const root = new Grid(1980, 833, { width: 3, height: 3 }, 16 / 9);
console.log(root.calcLayout());

root.setSize(2, 2);
console.log(root.calcLayout());
