package domain;

/**
 * 蓝图
 * <p>
 * Fan 2020/5/17
 */
public class BluePrint extends Type {

  /**
   * 产品数量
   */
  private final int maxProductionLimit;

  /**
   * 制造相关
   */
  private Manufacturing manufacturing;

  public BluePrint(int id, String name, int maxProductionLimit) {
    // 蓝图不需要关注体积
    super(id, name, 0f);
    this.maxProductionLimit = maxProductionLimit;
  }

  public Manufacturing getManufacturing() {
    return manufacturing;
  }

  public void setManufacturing(Manufacturing manufacturing) {
    this.manufacturing = manufacturing;
  }


}
