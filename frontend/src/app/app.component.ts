import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { BluePrintService } from 'src/service/blue-print.service';
import { BluePrint } from 'src/service/vo/blue-print';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'EVE蓝图助手';

  @ViewChild('bluePrintName') bluePrintNameInput: ElementRef;

  bluePrints: BluePrint[] = [];

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
      this.snackBar.open(err.message, '确定');
    });
  }

  ngAfterViewInit() {
    fromEvent<any>(this.bluePrintNameInput.nativeElement, 'input')
      .pipe(debounceTime(300))
      .subscribe(event => {
        this.onSearch(event.target.value);
      });
  }
}
