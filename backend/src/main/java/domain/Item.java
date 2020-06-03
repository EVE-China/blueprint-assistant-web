package domain;

public class Item {

  private Type type;

  private long quantity;

  public Item(Type type, long quantity) {
    this.type = type;
    this.quantity = quantity;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public long getQuantity() {
    return quantity;
  }

  public void setQuantity(long quantity) {
    this.quantity = quantity;
  }
}
