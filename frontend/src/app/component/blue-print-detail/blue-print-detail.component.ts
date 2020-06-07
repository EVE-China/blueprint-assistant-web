import { Component, OnInit, Input } from '@angular/core';
import { BluePrint } from 'src/service/vo/blue-print';
import { Subject, of } from 'rxjs';
import { MaterialItem, ProductItem } from './vo';
import { debounceTime, flatMap } from 'rxjs/operators';
import { PriceService } from 'src/service/price.service';
import { formatBySecond } from 'src/utils/time';

@Component({
  selector: 'app-blue-print-detail',
  templateUrl: './blue-print-detail.component.html',
  styleUrls: ['./blue-print-detail.component.scss']
})
export class BluePrintDetailComponent implements OnInit {

  @Input()
  bluePrint: BluePrint;

  /**
   * 材料研究等级
   */
  researchMaterial = 10;

  /**
   * 时间研究等级
   */
  researchTime = 20;

  displayedColumns = [ 'name', 'quantity', 'price', 'totalPrice', 'totalVolume' ];

  materials: MaterialItem[] = [];

  calcSubject: Subject<void> = new Subject();

  /**
   * 项目流程数
   */
  numberOfProjects = 1;

  /**
   * 生产线数
   */
  productionLines = 1;

  /**
   * 产品总数
   */
  productTotalQuantity: number;

  product: ProductItem;

  /**
   * 材料总价(总成本价)
   */
  materialTotalPrice: number;

  /**
   * 产品单个成本
   */
  productCost: number;

  /**
   * 产品总价
   */
  productTotalPrice: number;

  /**
   * 总利润
   */
  totalProfit: number;

  /**
   * 利润率
   */
  profitMargin: number;

  /**
   * 生产总耗时
   */
  totalTime: string;

  constructor(private priceService: PriceService) { }

  ngOnInit(): void {
    this.materials = this.bluePrint.manufacturing.materials.map(material => {
      return new MaterialItem(material, this.priceService, () => {
        this.triggerCalc();
      });
    });
    this.product = new ProductItem(this.bluePrint.manufacturing.product, this.priceService, () => {
      this.triggerCalc();
    });

    this.calcSubject.pipe(debounceTime(500)).subscribe(() => {
      this.calc();
    });
    this.triggerCalc();
  }

  updateResearchMaterial(value: string) {
    this.researchMaterial = parseInt(value, 10);
    this.triggerCalc();
  }

  getResearchMaterialPercentage() {
    return (100 - this.researchMaterial) / 100;
  }

  updateResearchTime(value: string) {
    this.researchTime = parseInt(value, 10);
    this.triggerCalc();
  }

  getResearchTimePercentage() {
    return (100 - this.researchTime) / 100;
  }

  updateNumberOfProjects(value: string) {
    this.numberOfProjects = parseInt(value, 10);
    this.triggerCalc();
  }

  updateProductionLines(value: string) {
    this.productionLines = parseInt(value, 10);
    this.triggerCalc();
  }

  triggerCalc() {
    this.calcSubject.next();
  }

  getTotalQuantity(material: MaterialItem) {
    const n = this.numberOfProjects * material.quantity * this.productionLines * this.getResearchMaterialPercentage();
    material.totalQuantity = Math.ceil(n);
    return material.totalQuantity;
  }

  getTotalPrice(material: MaterialItem) {
    return material.price.pipe(flatMap(price => {
      return of(price * material.totalQuantity);
    }));
  }

  calc() {
    // 材料总价, 成本价
    this.materialTotalPrice = this.materials.map(material => material.totalQuantity * material.price.getValue())
    .reduce((prev, current) => {
      return prev + current;
    });
    // 产品总数量
    this.productTotalQuantity = this.product.quantity * this.numberOfProjects * this.productionLines;
    // 产品单个成本
    this.productCost = this.materialTotalPrice / this.productTotalQuantity;
    // 产品总价
    this.productTotalPrice = this.productTotalQuantity * this.product.price.getValue();
    // 产品单个利润
    const productProfit = this.product.price.getValue() - this.productCost;
    // 总利润
    this.totalProfit = productProfit * this.productTotalQuantity;
    // 利润率
    this.profitMargin = productProfit / this.productCost * 100;
    // 生产耗时
    this.totalTime = formatBySecond(this.getResearchTimePercentage() * this.bluePrint.manufacturing.time);
  }
}
