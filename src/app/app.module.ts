import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { WetherWidgetComponent } from './wether-widget/wether-widget.component';
import { WetherItemComponent } from './wether-widget/wether-item/wether-item.component';
import { ItemAddComponent } from './wether-widget/item-add/item-add.component';
import { PagerComponent } from './wether-widget/pager/pager.component';

@NgModule({
  declarations: [
    AppComponent,
    WetherWidgetComponent,
    WetherItemComponent,
    ItemAddComponent,
    PagerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
