import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { wetherItem } from './wether.interface';
import { WetherService } from './wether.service';

@Component({
  selector: 'wether-widget',
  templateUrl: './wether-widget.component.html',
  styleUrls: ['./wether-widget.component.scss']
})
export class WetherWidgetComponent implements OnInit {

  wetherItems$: Observable<wetherItem[]> | undefined;

  constructor(public wetherData: WetherService) { }

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    await this.wetherData.getPlaceItems();
    this.wetherItems$ = this.wetherData.getData();
  }

  deletePlace(index: number) {
    this.wetherData.removePlaceItem(index);
  }

}
