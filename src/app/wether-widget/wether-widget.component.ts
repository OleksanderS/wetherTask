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

  wetherItems: wetherItem[] = [];

  constructor(public wetherData: WetherService) { }

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    await this.wetherData.getPlaceItems();
    this.wetherData.wetherItems.subscribe(pageItems => {
      this.wetherItems = pageItems;
    });
    this.wetherData.getCurPageData();
  }

  deletePlace(item: wetherItem) {
    this.wetherData.removePlaceItem(item);
  }

}
