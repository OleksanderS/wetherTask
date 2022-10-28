import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { placeItem, wetherItem, } from './wether.interface';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const storageKey = 'wetherWidgetItems'
const defaultItem: placeItem = {
  defaultItem: true,
  lat: 50.45,
  lon: 30.52,
  //'Kiev'
}

const SERVICE_URL = "https://fcc-weather-api.glitch.me/api/current";
const MAX_ITEMS_PERPAGE = 5;

@Injectable({
  providedIn: 'root'
})
export class WetherService {

  private placeItems: placeItem[] = [];
  public wetherItems = new BehaviorSubject<wetherItem[]>([]);
  public curPage: number = 1;
  public dataUpdated = new Subject<boolean>();

  constructor(protected http: HttpClient) {

  }


  refreshData() {
    this.getCurPageData();
    this.dataUpdated.next(true);
  }

  getData(): Observable<wetherItem[]> {
    return forkJoin(
      this.placeItems.map(item =>
        this.http.get<any[]>(`${SERVICE_URL}?lat=${item.lat}&lon=${item.lon}`))
    ).pipe(
      map((responseArr: any[]) => responseArr.reduce((arr: wetherItem[], respItem: any, index: number) => {
        const item: wetherItem = {
          place: this.placeItems[index],
          wetherData: respItem
        }
        return arr.concat(item);
      }, []))
    );
  }

  getCurPageItems(): placeItem[] {
    let firstItemIndex = (this.curPage - 1) * MAX_ITEMS_PERPAGE;
    firstItemIndex = firstItemIndex < 0 ? 0 : firstItemIndex;
    let lastItemIndex = firstItemIndex + MAX_ITEMS_PERPAGE;
    if (lastItemIndex  >=  this.placeItems.length) {
      return this.placeItems.slice(firstItemIndex);
    }
    return this.placeItems.slice(firstItemIndex, lastItemIndex);
  }

  getCurPageData() {
    const pageItems = this.getCurPageItems();
    forkJoin(
      pageItems.map(item =>
        this.http.get<any[]>(`${SERVICE_URL}?lat=${item.lat}&lon=${item.lon}`))
    ).pipe(
      map((responseArr: any[]) => responseArr.reduce((arr: wetherItem[], respItem: any, index: number) => {
        const item: wetherItem = {
          place: pageItems[index],
          wetherData: respItem
        }
        return arr.concat(item);
      }, []))
    ).subscribe((result: wetherItem[]) => {
      this.wetherItems.next(result);
      this.dataUpdated.next(true);
    });
  }


  async getPlaceItems() {
    const value = localStorage.getItem(storageKey);
    if  (value) {
      this.placeItems = JSON.parse(value);
    } else {
      this.placeItems =  await this.getDefaultPlace() as placeItem[];
    }
  }

  private updatePlaceItems() {
    localStorage.setItem(storageKey, JSON.stringify(this.placeItems));
  }

  private async getDefaultPlace() {
    return new Promise(resolve => {
      const defaultPlaces: placeItem[] = [];
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          defaultPlaces.push(
            { lat: position.coords.latitude,
              lon: position.coords.longitude,
              defaultItem: true
            });
            resolve(defaultPlaces);
        }, () => {
          defaultPlaces.push(defaultItem);
          resolve(defaultPlaces);
        });
      } else {
        defaultPlaces.push(defaultItem);
        resolve(defaultPlaces);
      }
    })
  }


  public addPlaceItem(lat: number, lon: number, defaultPlace: boolean = false) {
    this.placeItems.push({lat, lon, defaultItem: defaultPlace});
    this.updatePlaceItems();
    this.refreshData();
  }

  public removePlaceItem(remove: wetherItem) {
    const index = this.placeItems.findIndex(item => {
      return item.lat == remove.place.lat && item.lon == remove.place.lon;
    });
    this.placeItems.splice(index,1);
    this.updatePlaceItems();

    if (this.curPage > this.getPageCount()) {
      this.curPage-= 1;
    }
    this.refreshData();
  }


  setPage(page: number) {
    this.curPage = page;
    this.refreshData();
  }

  getPageCount(): number {
    let pageCount = Math.round(this.placeItems.length / MAX_ITEMS_PERPAGE);
    if (pageCount*MAX_ITEMS_PERPAGE < this.placeItems.length) {
      pageCount+=1;
    }
    return pageCount;
  }



}
