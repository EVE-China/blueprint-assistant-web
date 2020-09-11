import { Item } from 'src/service/vo/blue-print';
import { PriceService } from 'src/service/price.service';
import { BehaviorSubject } from 'rxjs';
import { GetPriceMethod } from 'src/service/vo/common';

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

  /**
   * 调整价格
   */
  adjustedPrice: number;

  constructor(item: Item, private priceService: PriceService, private triggerCalc: () => void) {
    this.id = item.type.id;
    this.name = item.type.name;
    this.quantity = item.quantity;
    this.totalQuantity = 0;
    this.volume = item.type.volume;
    // this.updatePrice(); TODO 在蓝图详情中调用
  }

  public updatePrice(getPriceMethod: GetPriceMethod) {
    this.priceService.query(this.id).subscribe(price => {
      switch (getPriceMethod) {
        case GetPriceMethod.SellMin:
          this.price.next(price.sell.min);
          break;
        case GetPriceMethod.BuyMax:
          this.price.next(price.buy.max);
          break;
      }
      this.adjustedPrice = price.eiv.adjusted_price;
      this.triggerCalc();
    });
  }
}

export class ProductItem extends MaterialItem {

  constructor(product: Item, priceService: PriceService, triggerCalc: () => void) {
    super(product, priceService, triggerCalc);
  }

  /**
   * 产品价格不需要变更获取方式
   */
  public updatePrice() {
    super.updatePrice(GetPriceMethod.SellMin);
  }
}
