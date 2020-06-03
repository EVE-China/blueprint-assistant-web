package domain;


import java.util.List;

/**
 * 制造
 * <p>
 * Fan 2020/5/22
 */
public class Manufacturing {

  /**
   * 耗时
   */
  private long time;

  /**
   * 制造材料需求
   */
  private List<Item> materials;

  /**
   * 产品
   */
  private Item product;

  public Manufacturing() {
  }

  public long getTime() {
    return time;
  }

  public List<Item> getMaterials() {
    return materials;
  }

  public Item getProduct() {
    return product;
  }

  public void setTime(long time) {
    this.time = time;
  }

  public void setMaterials(List<Item> materials) {
    this.materials = materials;
  }

  public void setProduct(Item product) {
    this.product = product;
  }
}
