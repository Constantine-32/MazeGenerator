import processing.core.PApplet;

public class Cell {

  private PApplet p;
  private int x;
  private int y;
  private boolean[] wall;
  private boolean visited;

  public Cell(PApplet p, int x, int y) {
    this.p = p;
    this.x = x;
    this.y = y;
    wall = new boolean[]{true, true, true, true};
    visited = false;
  }

  public void show() {
    int x0 = x * Sketch.SIZE;
    int y0 = y * Sketch.SIZE;
    int x1 = x0 + Sketch.SIZE;
    int y1 = y0 + Sketch.SIZE;

    p.stroke(128);
    if (wall[0]) p.line(x0, y0, x1, y0);
    if (wall[1]) p.line(x1, y0, x1, y1);
    if (wall[2]) p.line(x1, y1, x0, y1);
    if (wall[3]) p.line(x0, y1, x0, y0);
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public boolean isVisited() {
    return visited;
  }

  public void setVisited() {
    this.visited = true;
  }

  public void breakTop() {
    wall[0] = false;
  }

  public void breakRig() {
    wall[1] = false;
  }

  public void breakBot() {
    wall[2] = false;
  }

  public void breakLef() {
    wall[3] = false;
  }
}
