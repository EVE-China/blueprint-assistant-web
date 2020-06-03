import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'EVE蓝图助手';

  @ViewChild('bluePrintName') bluePrintNameInput: ElementRef;

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    fromEvent(this.bluePrintNameInput.nativeElement, "change").subscribe(event => {
      console.log(event);
    });
  }
}
