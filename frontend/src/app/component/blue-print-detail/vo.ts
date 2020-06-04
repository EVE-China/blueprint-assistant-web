import { Item } from 'src/service/vo/blue-print';
import { PriceService } from 'src/service/price.service';

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
   * 单个体积
   */
  volume: number;

  /**
   * 单价
   */
  price: number;

  constructor(item: Item, priceService: PriceService) {
    this.id = item.type.id;
    this.name = item.type.name;
    this.quantity = item.quantity;
    this.volume = item.type.volume;
    this.price = -1;
    priceService.query(this.id).subscribe(price => {
      this.price = price;
    });
  }
}
