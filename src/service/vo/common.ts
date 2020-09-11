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

export class PriceResponse {

  // 卖价
  sell: Price;

  // 买价
  buy: Price;

  /**
   * 预估价格
   */
  eiv: EIV;
}

/**
 * 价格对象
 */
export class Price {

  /**
   * 最高价
   */
  max: number;

  /**
   * 最低价
   */
  min: number;
}

export enum GetPriceMethod {

  /**
   * 按最低卖价
   */
  SellMin = 0,

  /**
   * 按最高买价
   */
  BuyMax = 1
}
