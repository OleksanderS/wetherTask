import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { placeItem, wetherItem, } from './wether.interface';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const storageKey = 'wetherWidgetItems'
const defaultItem: placeItem = {
  defaultItem: true,
  lat: 50.45,
  lon: 30.52,
  //'Kiev'
}
const defaultItem2: placeItem = {
  defaultItem: false,
  lat: 50.51809 ,
  lon: 30.80671,
  //'Brow'
}
const SERVICE_URL = "https://fcc-weather-api.glitch.me/api/current";
const MAX_ITEMS_PERPAGE = 5;

@Injectable({
  providedIn: 'root'
})
export class WetherService {

  private placeItems: placeItem[] = [];
  public wetherItems = new BehaviorSubject<wetherItem[]>([]);
  private curPage: number = 1;

  constructor(protected http: HttpClient) {

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
    let lastItemIndex = (this.curPage)*MAX_ITEMS_PERPAGE;
    lastItemIndex = lastItemIndex > this.placeItems.length ? this.placeItems.length-1 : lastItemIndex;
    let firstItemIndex = (this.curPage-1)*MAX_ITEMS_PERPAGE;
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
          place: this.placeItems[index],
          wetherData: respItem
        }
        return arr.concat(item);
      }, []))
    ).subscribe((result: wetherItem[]) => {
      this.wetherItems.next(result)
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

  private updatePlaceItems(placeItems: placeItem[]) {
    localStorage.setItem(storageKey, JSON.stringify(placeItems));
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
        defaultPlaces.push(defaultItem2);
        resolve(defaultPlaces);
      }
    })
  }


  public addPlaceItem(lat: number, lon: number, defaultPlace: boolean = false) {
    this.placeItems.push({lat, lon, defaultItem: defaultPlace});
    this.updatePlaceItems(this.placeItems);
  }

  public removePlaceItem(index: number) {
    this.placeItems.splice(index,1);
    this.updatePlaceItems(this.placeItems);
  }






}
