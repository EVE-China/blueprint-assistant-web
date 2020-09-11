import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { BluePrint } from 'src/service/vo/blue-print';
import { Subject, of, Subscription } from 'rxjs';
import { MaterialItem, ProductItem } from './vo';
import { debounceTime, flatMap, mergeMap } from 'rxjs/operators';
import { PriceService } from 'src/service/price.service';
import { formatBySecond } from 'src/utils/time';
import { Clipboard } from '@angular/cdk/clipboard';
import { BonusService } from 'src/service/bonus.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetPriceMethod } from 'src/service/vo/common';

@Component({
  selector: 'app-blue-print-detail',
  templateUrl: './blue-print-detail.component.html',
  styleUrls: ['./blue-print-detail.component.scss']
})
export class BluePrintDetailComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  /**
   * 是否处于激活状态
   */
  @Input()
  active = true;

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

  displayedColumns = [ 'name', 'quantity', 'price', 'totalPrice', 'totalVolume', 'settings' ];

  materials: MaterialItem[] = [];

  dataSource = new MatTableDataSource<MaterialItem>();

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
   * 产品单件利润
   */
  productProfit: number;

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
  totalTimeStr = '计算中';

  /**
   * 每小时利润
   */
  profitByHour: number;

  /**
   * 每天利润
   */
  profitByDay: number;

  /**
   * 项目总配置费
   */
  projectTotalCost: number;

  /**
   * 项目单条配置费
   */
  projectCost: number;

  /**
   * 加成变更通知
   */
  bonusNotifySubscription: Subscription;

  /**
   * 价格获取方式变更通知
   */
  getPriceMethodSubscription: Subscription;

  /**
   * 价格获取方式
   */
  getPriceMethod: GetPriceMethod;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private priceService: PriceService, private clipboard: Clipboard, private bonusService: BonusService) {
    this.getPriceMethod = priceService.getGetPriceMethod();
  }

  ngOnInit(): void {
    this.materials = this.bluePrint.manufacturing.materials.map(material => {
      const item = new MaterialItem(material, this.priceService, () => {
        this.triggerCalc();
      });
      item.updatePrice(this.getPriceMethod);
      return item;
    });
    this.dataSource.data = this.materials;
    this.dataSource.sortingDataAccessor = (data, id) => {
      switch (id) {
        case 'quantity':
          return this.getTotalQuantity(data);
        case 'price':
          return data.price.getValue();
        case 'totalPrice':
          return data.price.getValue() * data.totalQuantity;
        case 'totalVolume':
          return this.getTotalQuantity(data) * data.volume;
        default:
          return data.id;
      }
    };
    this.product = new ProductItem(this.bluePrint.manufacturing.product, this.priceService, () => {
      this.triggerCalc();
    });
    this.product.updatePrice();

    this.calcSubject.pipe(debounceTime(200)).subscribe(() => {
      this.calc();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.calcSubject.complete();
    if (null !== this.bonusNotifySubscription) {
      this.bonusNotifySubscription.unsubscribe();
    }
    if (null !== this.getPriceMethodSubscription) {
      this.getPriceMethodSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // 是否处于激活状态
    if (changes.active.currentValue) {
      this.bonusNotifySubscription = this.bonusService.getChangeNotify().subscribe(() => {
        this.triggerCalc();
      });
      this.getPriceMethodSubscription = this.priceService.getPriceMethodChangeNotify().subscribe(() => {
        this.getPriceMethod = this.priceService.getGetPriceMethod();
        this.onPriceRefresh();
      });
      this.triggerCalc();
    } else {
      this.bonusNotifySubscription.unsubscribe();
      this.bonusNotifySubscription = null;
    }
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
    return material.price.pipe(mergeMap(price => {
      return of(price * material.totalQuantity);
    }));
  }

  calc() {
    // 项目总配置费
    this.projectTotalCost = this.materials.map(material => material.totalQuantity * material.adjustedPrice)
      .reduce((prev, current) => {
        return prev + current;
      }) * this.bonusService.getFacilityTax();
    // 项目单条配置费
    this.projectCost = this.projectTotalCost / this.productionLines;
    // 材料总价, 成本价
    this.materialTotalPrice = this.materials.map(material => material.totalQuantity * material.price.getValue())
      .reduce((prev, current) => {
        return prev + current;
      }) + this.projectTotalCost;
    // 税率
    const taxRate = 1 + this.bonusService.getTaxRate();
    // 产品总数量
    this.productTotalQuantity = this.product.quantity * this.numberOfProjects * this.productionLines;
    // 产品单个成本
    this.productCost = this.materialTotalPrice / this.productTotalQuantity * taxRate;
    // 产品总价
    this.productTotalPrice = this.productTotalQuantity * this.product.price.getValue();
    // 产品单个利润
    this.productProfit = this.product.price.getValue() - this.productCost;
    // 总利润
    this.totalProfit = this.productProfit * this.productTotalQuantity;
    // 利润率
    this.profitMargin = this.productProfit / this.productCost * 100;
    // 生产耗时
    const totalTime = this.getResearchTimePercentage() * this.bluePrint.manufacturing.time * this.numberOfProjects;
    this.totalTimeStr = formatBySecond(totalTime);
    // 每秒利润
    const profitBySecond = this.totalProfit / totalTime;
    // 每小时利润
    this.profitByHour = profitBySecond * 60 * 60;
    // 每天利润
    this.profitByDay = this.profitByHour * 24;
  }

  onCopy() {
    const value = this.materials.map(material => {
      return `${material.name}\t${material.totalQuantity}`;
    }).join('\n');
    this.clipboard.copy(value);
  }

  /**
   * 将单价更新至最新价格
   */
  onPriceRefresh() {
    this.materials.forEach(material => material.updatePrice(this.getPriceMethod));
    this.product.updatePrice();
  }
}
