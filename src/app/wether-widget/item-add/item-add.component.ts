import { Component, OnInit } from '@angular/core';
import { WetherService } from '../wether.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'wether-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.scss']
})
export class ItemAddComponent implements OnInit {

  public itemForm: FormGroup;
  lat!: number;
  lon!: number;

  constructor(public wether: WetherService) {
    this.itemForm = new FormGroup({
      "lat" : new FormControl(this.lat, [Validators.required, Validators.min(0),Validators.max(360)]),
      "lon" : new FormControl(this.lon, [Validators.required, Validators.min(0),Validators.max(360)])
  });

  }

  ngOnInit(): void {
  }


  addPlace() {
    if (this.itemForm.valid) {
      this.wether.addPlaceItem(this.itemForm.value.lat, this.itemForm.value.lon);
    }

}
}
