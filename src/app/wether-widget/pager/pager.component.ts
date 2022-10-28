import { Component, OnInit } from '@angular/core';
import { WetherService } from '../wether.service';

@Component({
  selector: 'wether-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {

  pageCount: number = 0;
  curPage: number = 0;

  constructor(public wetherData: WetherService) { }

  ngOnInit(): void {
    this.wetherData.dataUpdated.subscribe(()=>{
      this.curPage = this.wetherData.curPage;
      this.pageCount = this.wetherData.getPageCount();
    })
  }

  setPage(page:number) {
    this.wetherData.curPage = page;
    this.wetherData.refreshData();
  }

}
