import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable, fromEvent, timer } from 'rxjs';
import { BluePrintService } from 'src/service/blue-print.service';
import { BluePrint } from 'src/service/vo/blue-print';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'EVE蓝图助手';

  @ViewChild('bluePrintName') bluePrintNameInput: ElementRef;

  bluePrints: BluePrint[] = [];

  /**
   * tab中的蓝图
   */
  selectBluePrints: BluePrint[] = [];

  selectedIndex: number;

  constructor(private bluePrintService: BluePrintService,
              private snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.onSearch();
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
      timer(1).subscribe(() => {
        this.selectedIndex = this.selectBluePrints.length - 1;
      });
    } else {
      this.selectedIndex = index;
    }
  }

  removeTab(bluePrint: BluePrint) {
    this.selectBluePrints = this.selectBluePrints.filter(item => item.id !== bluePrint.id);
  }
}
