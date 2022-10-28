import { Component, Input, OnInit } from '@angular/core';
import { wetherItem } from '../wether.interface';

@Component({
  selector: 'wether-item',
  templateUrl: './wether-item.component.html',
  styleUrls: ['./wether-item.component.scss']
})
export class WetherItemComponent implements OnInit {
  @Input() data!: wetherItem;
  constructor() { }

  ngOnInit(): void {

  }


  isDataRight(): boolean {
    return this.data.place.lat == this.data.wetherData.coord.lat &&
            this.data.place.lon == this.data.wetherData.coord.lon;

  }

  isDedaultItem(): boolean {
    return this.data.place.defaultItem;
  }

}
