type Cell = {
  width: number;
  height: number;
};

export class Grid {
  static calcGridSize(n: number) {
    const size = Math.ceil(Math.sqrt(n));

    return {
      width: size,
      height: size,
    };
  }

  private grid: Cell[] = [];

  constructor(
    private width: number,
    private height: number,
    private gridSize: { width: number; height: number },
    private aspectRatio: number
  ) {
    this.#init();
  }

  get #unitSize() {
    let unitWidth = this.width / this.gridSize.width;
    let unitHeight = unitWidth / this.aspectRatio;

    if (unitHeight * this.gridSize.height <= this.height) {
      return {
        width: Math.floor(unitWidth),
        height: Math.floor(unitHeight),
      };
    }

    unitHeight = this.height / this.gridSize.height;
    unitWidth = unitHeight * this.aspectRatio;

    return {
      width: Math.floor(unitWidth),
      height: Math.floor(unitHeight),
    };
  }

  #init() {
    const { width, height } = this.#unitSize;

    this.grid = [...Array(this.gridSize.width * this.gridSize.height)].map(
      () => ({ width, height })
    );
  }

  setSize(width: number, height: number) {
    this.gridSize = { width, height };
    this.#init();
  }

  calcLayout() {
    const { width, height } = this.gridSize;

    const { width: unitWidth, height: unitHeight } = this.#unitSize;

    const bbs = this.grid.map((cell, i) => ({
      x: Math.floor(i % width),
      y: Math.floor(i / height),
      width: cell.width,
      height: cell.height,
    }));

    const gridWidth = unitWidth * width;
    const gridHeight = unitHeight * height;
    const offsX = Math.floor((this.width - gridWidth) / 2);
    const offsY = Math.floor((this.height - gridHeight) / 2);

    return bbs.map(({ x, y, width, height }) => ({
      x: x * unitWidth + offsX,
      y: y * unitHeight + offsY,
      width,
      height,
    }));
  }
}
