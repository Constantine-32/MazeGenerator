import processing.core.PApplet;

import java.util.ArrayList;
import java.util.Stack;

public class Grid {

  private PApplet p;
  private ArrayList<Cell> grid;
  private Cell current;
  private Stack<Cell> stack;

  public Grid(PApplet p) {
    this.p = p;
    grid = new ArrayList<>();
    for (int y = 0; y < Sketch.ROW; y++) {
      for (int x = 0; x < Sketch.COL; x++) {
        grid.add(new Cell(p, x, y));
      }
    }
    current = grid.get(0);
    current.setVisited();
    stack = new Stack<>();
  }

  private int index(int x, int y) {
    if (x < 0 || y < 0 || x >= Sketch.COL || y >= Sketch.ROW) return -1;
    else return y * Sketch.COL + x;
  }

  private boolean hasUnvisitedNeighbour() {
    for (Cell aGrid : grid) {
      if (!aGrid.isVisited()) return true;
    }
    return false;
  }

  private Cell getUnvisitedNeighbour(int x, int y) {
    ArrayList<Cell> neighbours = new ArrayList<>();
    int index;

    index = index(x, y - 1);
    if (index != -1 && !grid.get(index).isVisited()) neighbours.add(grid.get(index));
    index = index(x + 1, y);
    if (index != -1 && !grid.get(index).isVisited()) neighbours.add(grid.get(index));
    index = index(x, y + 1);
    if (index != -1 && !grid.get(index).isVisited()) neighbours.add(grid.get(index));
    index = index(x - 1, y);
    if (index != -1 && !grid.get(index).isVisited()) neighbours.add(grid.get(index));

    if (neighbours.size() > 0) return neighbours.get((int) Math.floor(p.random(neighbours.size())));
    else return null;
  }

  private void removeWalls(Cell a, Cell b) {
    int x = a.getX() - b.getX();
    if (x == 1) {
      a.breakLef();
      b.breakRig();
    } else if (x == -1) {
      a.breakRig();
      b.breakLef();
    }
    int y = a.getY() - b.getY();
    if (y == 1) {
      a.breakTop();
      b.breakBot();
    } else if (y == -1) {
      a.breakBot();
      b.breakTop();
    }
  }

  public void show() {
    p.background(153);

    for (Cell aGrid : grid) {
      if (aGrid.isVisited()) {
        p.noStroke();
        p.fill(255);
        p.rect(aGrid.getX() * Sketch.SIZE + 1, aGrid.getY() * Sketch.SIZE + 1, Sketch.SIZE, Sketch.SIZE);
      }
    }
    for (Cell aGrid : stack) {
      p.noStroke();
      p.fill(200);
      p.rect(aGrid.getX() * Sketch.SIZE, aGrid.getY() * Sketch.SIZE, Sketch.SIZE, Sketch.SIZE);
    }
    for (Cell aGrid : grid) aGrid.show();

    p.fill(20);
    p.rect(current.getX() * Sketch.SIZE, current.getY() * Sketch.SIZE, Sketch.SIZE, Sketch.SIZE);

    if (hasUnvisitedNeighbour() || stack.size() > 0) {
      Cell next = getUnvisitedNeighbour(current.getX(), current.getY());
      if (next != null) {
        stack.push(current);
        removeWalls(current, next);
        current = next;
        current.setVisited();
      } else if (!stack.empty()) {
        current = stack.pop();
      }
    }
  }
}
