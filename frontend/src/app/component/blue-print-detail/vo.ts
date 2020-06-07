import { Item } from 'src/service/vo/blue-print';
import { PriceService } from 'src/service/price.service';
import { Observable, BehaviorSubject } from 'rxjs';

export class MaterialItem {

  /**
   * 编号
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 单流程数量
   */
  quantity: number;

  /**
   * 总数量
   */
  totalQuantity: number;

  /**
   * 单个体积
   */
  volume: number;

  /**
   * 单价
   */
  price = new BehaviorSubject(-1);

  constructor(item: Item, priceService: PriceService, triggerCalc: Function) {
    this.id = item.type.id;
    this.name = item.type.name;
    this.quantity = item.quantity;
    this.totalQuantity = 0;
    this.volume = item.type.volume;
    priceService.query(this.id).subscribe(price => {
      this.price.next(price);
      triggerCalc();
    });
  }
}

export class ProductItem {

  /**
   * 产品编号
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 单流程数量
   */
  quantity: number;

  /**
   * 单价
   */
  price = new BehaviorSubject(-1);

  /**
   * 体积
   */
  volume: number;

  constructor(product: Item, priceService: PriceService, triggerCalc: Function) {
    const type = product.type;
    this.id = type.id;
    this.name = type.name;
    this.quantity = product.quantity;
    this.volume = type.volume;
    priceService.query(this.id).subscribe(price => {
      this.price.next(price);
      triggerCalc();
    });
  }
}
