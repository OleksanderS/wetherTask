export interface placeItem {
  lat: number;
  lon: number;
  defaultItem: boolean;
}


export interface wetherItem {
  place: placeItem;
  wetherData: any;
}
