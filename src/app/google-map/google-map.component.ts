import { Component, OnInit } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';

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
  isDragging = false;
  currentLocationMarker: google.maps.LatLngLiteral | null = null;
  areaInRai = 0; // พื้นที่ในหน่วยไร่
  areaInNgan = 0; // พื้นที่ในหน่วยงาน

  constructor(private geocoder: MapGeocoder) {}

  ngOnInit(): void {}

  onPolygonEdit(event: google.maps.MapMouseEvent): void {
    const path = event.latLng;
    if (path) {
      this.polygonCoords = [...this.polygonCoords, path.toJSON()];
      this.calculateArea(); // คำนวณพื้นที่หลังจากการแก้ไข
    }
  }

  onClearPolygon(): void {
    this.polygonCoords = [];
    this.currentLocationMarker = null;
    this.areaInRai = 0;
    this.areaInNgan = 0;
  }

  onSearchPlace(): void {
    this.geocoder.geocode({ address: this.searchQuery }).subscribe((result) => {
      if (result.results.length > 0) {
        this.mapCenter = result.results[0].geometry.location.toJSON();
        this.zoom = 15;
      }
    });
  }

  onDragStart(): void {
    this.isDragging = true;
  }

  onDragEnd(): void {
    this.isDragging = false;
  }

  onCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.mapCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.zoom = 15;
          this.currentLocationMarker = this.mapCenter;
        },
        (error) => {
          console.error('Error getting current location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  calculateArea(): void {
    const areaInSquareMeters = google.maps.geometry.spherical.computeArea(
      this.polygonCoords.map(coord => new google.maps.LatLng(coord.lat, coord.lng))
    );

    const areaInSquareWah = areaInSquareMeters / 4; // 1 ตารางวา = 4 ตารางเมตร
    const areaInRai = Math.floor(areaInSquareWah / 400); // 1 ไร่ = 400 ตารางวา
    const remainingWah = areaInSquareWah % 400;
    const areaInNgan = Math.floor(remainingWah / 100); // 1 งาน = 100 ตารางวา

    this.areaInRai = areaInRai;
    this.areaInNgan = areaInNgan;
  }
}
