import { Type } from './common';

export class Item {

  type: Type;

  quantity: number;
}

export class Manufacturing {

  /**
   * 耗时
   */
  time: number;

  /**
   * 制造材料需求
   */
  materials: Item[];

  /**
   * 产品
   */
  product: Item;
}

/**
 * 蓝图
 */
export class BluePrint extends Type {

  /**
   * 产品数量
   */
  maxProductionLimit: number;

  /**
   * 制造相关
   */
  manufacturing: Manufacturing;
}
