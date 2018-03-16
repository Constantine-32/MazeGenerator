'use strict';

class Cell {
  constructor(x, y, s) {
    this.x = x
    this.y = y
    this.s = s
    this.w = [true, true, true, true]
    this.v = false
  }

  draw() {
    let x0 = this.x * this.s
    let y0 = this.y * this.s
    let x1 = x0 + this.s
    let y1 = y0 + this.s
    stroke('#111')
    if (this.w[0]) line(x0, y0, x1, y0)
    if (this.w[1]) line(x1, y0, x1, y1)
    if (this.w[2]) line(x1, y1, x0, y1)
    if (this.w[3]) line(x0, y1, x0, y0)
  }

  isVisited() {
    return this.v;
  }

  setVisited() {
    this.v = true;
  }

  breakTop() {
    this.w[0] = false;
  }

  breakRig() {
    this.w[1] = false;
  }

  breakBot() {
    this.w[2] = false;
  }

  breakLef() {
    this.w[3] = false;
  }
}

class Grid {
  constructor(row, col, size) {
    this.row = row
    this.col = col
    this.size = size
    this.grid = []
    for (let y = 0; y < row; y++)
      for (let x = 0; x < col; x++)
        this.grid[y * col + x] = new Cell(x, y, size)
    this.current = this.grid[0]
    this.current.setVisited()
    this.stack = []
  }

  getIndex(x, y) {
    if (x < 0 || y < 0 || x >= this.col || y >= this.row) return -1
    else return y * this.col + x
  }

  hasUnvisitedNeighbour() {
    for (let cell of this.grid)
      if (!cell.isVisited())
        return true
    return false
  }

  getUnvisitedNeighbour(x, y) {
    let neighbours = []
    let index = this.getIndex(x, y - 1)
    if (index !== -1 && !this.grid[index].isVisited()) neighbours.push(this.grid[index])
    index = this.getIndex(x + 1, y)
    if (index !== -1 && !this.grid[index].isVisited()) neighbours.push(this.grid[index])
    index = this.getIndex(x, y + 1)
    if (index !== -1 && !this.grid[index].isVisited()) neighbours.push(this.grid[index])
    index = this.getIndex(x - 1, y)
    if (index !== -1 && !this.grid[index].isVisited()) neighbours.push(this.grid[index])
    if (neighbours.length > 0) return neighbours[Math.floor(random(neighbours.length))]
    else return null
  }

  removeWalls(a, b) {
    let x = a.x - b.x;
    if (x === 1) {
      a.breakLef();
      b.breakRig();
    } else if (x === -1) {
      a.breakRig();
      b.breakLef();
    }
    let y = a.y - b.y;
    if (y === 1) {
      a.breakTop();
      b.breakBot();
    } else if (y === -1) {
      a.breakBot();
      b.breakTop();
    }
  }

  draw() {
    background('#111');

    for (let cell of this.grid) {
      if (cell.isVisited()) {
        noStroke();
        fill('#222');
        rect(cell.x * this.size + 1, cell.y * this.size + 1, this.size, this.size);
      }
    }
    for (let cell of this.stack) {
      noStroke();
      fill('#222');
      rect(cell.x * this.size, cell.y * this.size, this.size, this.size);
    }

    for (let cell of this.grid)
      cell.draw();

    fill('#eee');
    rect(this.current.x * this.size, this.current.y * this.size, this.size, this.size);

    if (this.hasUnvisitedNeighbour() || this.stack.size() > 0) {
      let next = this.getUnvisitedNeighbour(this.current.x, this.current.y);
      if (next !== null) {
        this.stack.push(this.current);
        this.removeWalls(this.current, next);
        this.current = next;
        this.current.setVisited();
      } else if (this.stack.length !== 0) {
        this.current = this.stack.pop();
      }
    }
  }
}

const row = 40;
const col = 40;
const size = 10;
const grid = new Grid(row, col, size);

let cnv

function centerCanvas() {
  let x = (windowWidth - width) / 2
  let y = (windowHeight - height) / 2
  cnv.position(x, y)
}

function setup() {
  cnv = createCanvas(col * size + 1, row * size + 1)
  centerCanvas()
  background(255, 0, 200)
  frameRate(20)
  grid.draw()
}

function windowResized() {
  centerCanvas()
}

function draw() {
  grid.draw()
}
