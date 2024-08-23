import { Component, OnInit } from '@angular/core';
import { MapPolygon, MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  mapCenter = { lat: 13.7563, lng: 100.5018 };
  zoom = 10;
  polygonCoords: google.maps.LatLngLiteral[] = [];
  polygonOptions: google.maps.PolygonOptions = {
    editable: true,
    draggable: true,
    fillColor: 'blue',
    fillOpacity: 0.3,
    strokeColor: 'blue',
    strokeOpacity: 0.8,
    strokeWeight: 2,
  };
  searchQuery: string = '';

  constructor(private geocoder: MapGeocoder) {}

  ngOnInit(): void {}

  onPolygonEdit(event: google.maps.MapMouseEvent): void {
    const path = event.latLng;
    if (path) {
      this.polygonCoords = [...this.polygonCoords, path.toJSON()];
    }
  }

  onClearPolygon(): void {
    this.polygonCoords = [];
  }

  onSearchPlace(): void {
    this.geocoder.geocode({ address: this.searchQuery }).subscribe((result) => {
      if (result.results.length > 0) {
        this.mapCenter = result.results[0].geometry.location.toJSON();
        this.zoom = 15;
      }
    });
  }
}
