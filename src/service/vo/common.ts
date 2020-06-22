/**
 * 类型
 * <p>
 * Fan 2020/5/22
 */
export class Type {

  /**
   * 编号
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 体积
   */
  volume: number;
}

/**
 * 物品预估价格
 */
export class EIV {

  /**
   * 调整后价格
   */
  adjusted_price: number;

  /**
   * 平均价格
   */
  average_price: number;
}

/**
 * 价格对象
 */
export class Price {

  /**
   * 最高卖价
   */
  max: number;

  /**
   * 最低卖价
   */
  min: number;

  /**
   * 预估价格
   */
  eiv: EIV;
}
