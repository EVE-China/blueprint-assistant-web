import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { BluePrintService } from 'src/service/blue-print.service';
import { BluePrint } from 'src/service/vo/blue-print';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentChecked {

  title = 'EVE蓝图助手';

  @ViewChild('bluePrintName') bluePrintNameInput: ElementRef;

  bluePrints: BluePrint[] = [];

  /**
   * tab中的蓝图
   */
  selectBluePrints: BluePrint[] = [];

  selectedIndex: number;

  @ViewChild('toolbar', { static: true })
  toolbar: MatToolbar;

  toolbarHeight = 0;

  constructor(private bluePrintService: BluePrintService,
              private snackBar: MatSnackBar,
              iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private changeDetectorRef: ChangeDetectorRef) {
    iconRegistry.addSvgIcon('github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/svg/github-circle-white-transparent.svg'));
    iconRegistry.addSvgIcon('baidu',
    sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baidu.svg'));
  }
  ngAfterContentChecked(): void {
    this.toolbarHeight = this.toolbar._elementRef.nativeElement.scrollHeight;
  }

  ngOnInit(): void {
  }

  onSearch(name = '') {
    this.bluePrintService.findAllByName(name).subscribe(bluePrints => {
      this.bluePrints = bluePrints;
    }, err => {
      this.snackBar.open(err.message, '确定', {
        duration: 3000
      });
    });
  }

  ngAfterViewInit() {
    fromEvent<any>(this.bluePrintNameInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.onSearch(event.target.value);
      });
  }

  onSelect(bluePrint: BluePrint) {
    this.bluePrintService.getManufacturingByTypeId(bluePrint.id)
      .subscribe(manufacturing => {
        bluePrint.manufacturing = manufacturing;
        this.addTab(bluePrint);
      }, err => {
        this.snackBar.open(err.message, '确定', {
          duration: 3000
        });
      });
  }

  addTab(bluePrint: BluePrint) {
    const index = this.selectBluePrints.findIndex(v => v.id === bluePrint.id);
    if (-1 === index) {
      this.selectBluePrints.push(bluePrint);
      this.selectedIndex = this.selectBluePrints.length - 1;
    } else {
      this.selectedIndex = index;
    }
    this.changeDetectorRef.detectChanges();
  }

  removeTab(bluePrint: BluePrint) {
    this.selectBluePrints = this.selectBluePrints.filter(item => item.id !== bluePrint.id);
  }

  calcHeight() {
    return `calc(100% - ${this.toolbarHeight}px)`;
  }
}
