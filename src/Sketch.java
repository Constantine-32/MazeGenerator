import processing.core.PApplet;

public class Sketch extends PApplet {

  static final int W = 400;
  static final int H = 400;
  static final int SIZE = 10;
  static final int COL = W / SIZE;
  static final int ROW = H / SIZE;

  private Grid myGrid = new Grid(this);

  public static void main(String[] args) {
    PApplet.main(new String[]{"Sketch"});
  }

  public void settings() {
    size(400, 400);
  }

  public void setup() {
    frameRate(20);
    myGrid.show();
  }

  public void draw() {
    myGrid.show();
  }
}
