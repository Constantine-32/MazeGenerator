'use strict';

class Cell {
  constructor(x, y, d) {
    this.x = x
    this.y = y
    this.d = d
    this.w = [true, true, true, true]
    this.v = false
  }

  draw() {
    const s = height / this.d
    let x0 = this.x * s
    let y0 = this.y * s
    let x1 = x0 + s
    let y1 = y0 + s
    stroke('#0e0e0e')
    if (this.w[0]) line(x0, y0, x1, y0)
    if (this.w[1]) line(x1, y0, x1, y1)
    if (this.w[2]) line(x1, y1, x0, y1)
    if (this.w[3]) line(x0, y1, x0, y0)
  }

  isVisited() {
    return this.v
  }

  setVisited() {
    this.v = true
  }

  breakTop() {
    this.w[0] = false
  }

  breakRig() {
    this.w[1] = false
  }

  breakBot() {
    this.w[2] = false
  }

  breakLef() {
    this.w[3] = false
  }
}

class Grid {
  constructor(row, col) {
    this.row = row
    this.col = col
    this.grid = []
    for (let y = 0; y < row; y++)
      for (let x = 0; x < col; x++)
        this.grid[y * col + x] = new Cell(x, y, this.row)
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

  static removeWalls(a, b) {
    let x = a.x - b.x
    if (x === 1) {
      a.breakLef()
      b.breakRig()
    } else if (x === -1) {
      a.breakRig()
      b.breakLef()
    }
    let y = a.y - b.y
    if (y === 1) {
      a.breakTop()
      b.breakBot()
    } else if (y === -1) {
      a.breakBot()
      b.breakTop()
    }
  }

  draw() {
    const size = height / this.row
    background('#0e0e0e')

    for (let cell of this.grid) {
      if (cell.isVisited()) {
        noStroke()
        fill('#222')
        rect(cell.x * size + 1, cell.y * size + 1, size, size)
      }
    }

    for (let cell of this.stack) {
      noStroke()
      fill('#333')
      rect(cell.x * size, cell.y * size, size, size)
    }

    for (let cell of this.grid)
      cell.draw()

    if (this.stack.length > 0) {
      fill('#eee')
      rect(this.current.x * size, this.current.y * size, size, size)
    }

    if (this.hasUnvisitedNeighbour() || this.stack.length > 0) {
      let next = this.getUnvisitedNeighbour(this.current.x, this.current.y)
      if (next !== null) {
        this.stack.push(this.current)
        Grid.removeWalls(this.current, next)
        this.current = next
        this.current.setVisited()
      } else if (this.stack.length > 0) {
        this.current = this.stack.pop()
      }
    }
  }
}

const grid = new Grid(50, 50)

function setup() {
  createCenteredCanvas()
  frameRate(60)
  draw()
}

function windowResized() {
  createCenteredCanvas()
  draw()
}

function createCenteredCanvas() {
  const size =
    (windowWidth <= 540 || windowHeight <= 630) +
    (windowWidth <= 960 || windowHeight <= 800)
  const dim = [600, 450, 300][size]
  createCanvas(dim, dim).position(
    (windowWidth - width) / 2,
    (windowHeight - height) / 2
  )
}

function draw() {
  grid.draw()
}
