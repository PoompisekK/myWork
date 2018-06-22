import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';

import { CheckInOutModel } from '../../model/checkInOut.model';
import { MeetingModel } from '../../model/meeting.model.ts';
import { WorkforceService } from '../../service/workforceService';

declare let google;

@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMap implements OnInit, OnDestroy {
  @Input('meeting') public meeting: MeetingModel;
  // @ViewChild('pacInput') pacInputElement: ElementRef;
  @ViewChild('map') private mapElement: ElementRef;
  private map: any;
  private options: GeolocationOptions;
  private currentPos: Geoposition;
  private currentDate: Date;
  private enTranceTime: CheckInOutModel = new CheckInOutModel();
  private seletedPlace: any;
  private mapMarkers: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    private workforceService: WorkforceService,
    private events: Events,
  ) {

  }

  //Definition for the map component to take care of generating a new map

  // public ionViewWillEnter(){
  //   this.loadMap()
  // }

  public ngOnInit() {
    this.currentDate = new Date();
    setInterval(() => {
      this.currentDate = new Date();
    }, 30000);
    // this.loadMap()
  }
  public ngOnDestroy() {
  }
  public ionViewWillEnter() {
    setTimeout(() => {
      this.loadMap();
    }, 500);

  }
  // ionViewDidLoad() {
  //   this.loadMap()
  // }

  private loadMap() {
    let previousLatLng = null;
    let map = null;
    let blueDotCurrLatLng = null;
    let paramPlaces = this.navParams.get("seletedPlace");
    let formPage = this.navParams.get("formPage");
    console.log("formPage :", formPage);

    if (paramPlaces && paramPlaces.coords && (paramPlaces.coords.lat && paramPlaces.coords.lng)) {
      previousLatLng = new google.maps.LatLng(paramPlaces.coords.lat, paramPlaces.coords.lng);
    }

    /*
    if (paramPlaces && formPage == "assignment") {
      latLng = new google.maps.LatLng(paramPlaces.coords.lat, paramPlaces.coords.lng);
      
      this.getCurrentLatLng((respPosition) => {
        if (paramPlaces.coords.lat == null || paramPlaces.coords.lng == null) {
          latLng = new google.maps.LatLng(respPosition.coords.latitude, respPosition.coords.longitude);
        }

        map = new google.maps.Map(this.mapElement.nativeElement, {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          draggable: false,
          scaleControl: false,
          scrollwheel: false,
          navigationControl: false,
          streetViewControl: false,
        });

        blueDotCurrLatLng = new google.maps.Marker({
          map: map,
          clickable: true,
          icon: new google.maps.MarkerImage('./assets/img/icon/mobileimgs2.png',
            new google.maps.Size(22, 22),
            new google.maps.Point(0, 18),
            new google.maps.Point(11, 11)),
          shadow: null,
          title: paramPlaces.name || "Your current location",
          position: latLng
        });
        this.mapMarkers.push(blueDotCurrLatLng);
        this.seletedPlace = this.searchPlace(map, this.mapMarkers);
      });

    } else { 
    */
    // Sets the map on all markers in the array.
    let setMapOnAll = (map): void => {
      for (let i = 0; i < this.mapMarkers.length; i++) {
        this.mapMarkers[i].setMap(map);
      }
    };

    // Removes the markers from the map, but keeps them in the array.
    let clearMarkers = (): void => {
      setMapOnAll(null);
    };

    // Shows any markers currently in the array.
    let showMarkers = (): void => {
      setMapOnAll(map);
    };

    // Deletes all markers in the array by removing references to them.
    let deleteMarkers = (): void => {
      clearMarkers();
      this.mapMarkers = [];
    };
    this.getCurrentLatLng((position) => {
      let clatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map = new google.maps.Map(this.mapElement.nativeElement, {
        center: clatLng,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      map.addListener('click', (data) => {
        deleteMarkers();
        this.addMarkerPicker(map, data.latLng);
      });

      //previous selection
      previousLatLng && this.addMarkerPicker(map, previousLatLng);

      blueDotCurrLatLng = new google.maps.Marker({
        map: map,
        clickable: true,
        icon: new google.maps.MarkerImage('./assets/img/icon/mobileimgs2.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 18),
          new google.maps.Point(11, 11)),
        shadow: null,
        zIndex: 999,
        title: "Current Position",
        animation: google.maps.Animation.DROP,
        position: clatLng
      });

      this.seletedPlace = this.searchPlace(map, this.mapMarkers);
      // this.workforceService.seletedPlace = { coords: { lat: position.coords.latitude, lng: position.coords.longitude }, name: "Not specify" }
    });

    //default set current position
    /* } */
  }

  public getCurrentLatLng(cb: (data: any) => void) {
    this.geolocation.getCurrentPosition().then((position) => {
      cb(position);
    }, err => {
      console.error("getCurrentLatLng error :", err);
      cb(err);
    });
  }

  // Adds a marker to the map and push to the array.
  private addMarkerPicker(map, _location): void {
    let _locationName = "";
    let seletedPlace = {
      coords: {
        lat: _location.lat(),
        lng: _location.lng()
      },
      name: _locationName,
      urlPhotos: []
    };

    let geocoder = new google.maps.Geocoder;
    let marker = new google.maps.Marker({
      position: _location,
      animation: google.maps.Animation.DROP,
      map: map
    });
    this.mapMarkers.push(marker);

    geocoder.geocode({ 'location': _location }, (results, status) => {
      if (status === 'OK') {
        let infoWindow = new google.maps.InfoWindow({
          content: "lat:" + _location.lat() + ", lng:" + _location.lng()
        });

        if (results[0]) {
          console.log("seletedPlace results[0]:", results[0]);

          _locationName = (results[0] || {}).formatted_address || '';
          seletedPlace.name = _locationName;
          infoWindow.setContent(_locationName);
          infoWindow.open(map, marker);
        }
      } else {
        console.warn('Geocoder failed due to :' + status);
      }
    });
    this.workforceService.seletedPlace = seletedPlace;
  }

  public searchPlace(map, markers) {
    let input = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(input);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // tslint:disable-next-line:only-arrow-functions
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    // tslint:disable-next-line:only-arrow-functions
    return searchBox.addListener('places_changed', function () {

      let places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      // tslint:disable-next-line:only-arrow-functions
      markers.forEach(function (markerItm) {
        markerItm.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();
      this.place = places[0];
      // console.log(places);
      // console.log(this.place.geometry.location.lat());
      // this.initialPlace.setMap(null);
      if (!this.place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      let icon = {
        url: this.place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        title: this.place.name,
        position: this.place.geometry.location
      }));

      if (this.place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(this.place.geometry.viewport);
      } else {
        bounds.extend(this.place.geometry.location);
      }

      // this.place = {coords:{lat:this.place.geometry.location.lat(),lng:this.place.geometry.location.lng()},name:this.place.name};
      map.fitBounds(bounds);
      // return this.place;
    });
  }

  //Add Markers and Info Windows to the Map
  public addMarker(map) {
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });

    let content = "<p>This is your current position !</p>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });

  }
  private submit() {
    if (this.seletedPlace.f.hasOwnProperty("place")) {
      console.log(this.seletedPlace);
      let urlPhotos = [];
      // this.seletedPlace.f.place.photos.forEach(element => {
      //   urlPhotos.push(element.getUrl({ 'maxWidth': 1000, 'maxHeight': 1000 }));
      // });
      this.workforceService.seletedPlace = {
        coords: {
          lat: this.seletedPlace.f.place.geometry.location.lat(),
          lng: this.seletedPlace.f.place.geometry.location.lng()
        },
        name: this.seletedPlace.f.place.name,
        urlPhotos: urlPhotos
      };
      this.seletedPlace = null;
      // } else {

    }

    //TODO
    // this.workforceService.seletedPlace = this.place;
    this.navCtrl.pop().then(() => {
      // Trigger custom event and pass data to be send back
      this.events.publish('maps-seletedPlace', this.workforceService.seletedPlace);
    });
  }

}
