import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [AppComponent, GoogleMapComponent],
  imports: [BrowserModule, FormsModule, GoogleMapsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
