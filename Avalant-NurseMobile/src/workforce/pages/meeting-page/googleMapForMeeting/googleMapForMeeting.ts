import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { NavController } from 'ionic-angular';

import { MeetingModel } from '../../../model/meeting.model.ts';

declare var google;

@Component({
  selector: 'googleMapForMeeting',
  templateUrl: 'googleMapForMeeting.html'
})
export class GoogleMapForMeeting implements OnInit {
  @Input('meeting') public meeting: MeetingModel;
  // @ViewChild('pacInput') pacInputElement: ElementRef;
  @ViewChild('map') public mapElement: ElementRef;
  private map: any;
  private options: GeolocationOptions;
  private currentPos: Geoposition;

  constructor(
    public navCtrl: NavController,
  ) {

  }

  //Definition for the map component to take care of generating a new map

  public ngOnInit() {
    setTimeout(() => {
      this.loadMap();
    }, 300);

    // ionViewDidLoad(){

    // this.loadMap();
  }

  // openMap() {
  //     this.loadMap();
  // }
  private loadMap() {
    console.log(this.meeting.latitude + ' ' + this.meeting.longitude);

    // let latLng = new google.maps.LatLng(this.meeting.latitude, this.meeting.longtitude);
    // setTimeout(()=>{
    //   console.log(latLng);
    // let mapOptions = {
    //   center: {lat: this.meeting.latitude, lng: this.meeting.longtitude},
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }

    let latLng = new google.maps.LatLng(this.meeting.latitude, this.meeting.longitude);
    let map = new google.maps.Map(this.mapElement.nativeElement, {
      center: latLng,
      zoom: 15,
      mapTypeControl: false,
      draggable: false,
      scaleControl: false,
      scrollwheel: false,
      navigationControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY

    this.addMarker(map);
    // },1500);

  }
  // searchPlace(map){
  //   let input = document.getElementById('pac-input');
  //   let searchBox = new google.maps.places.SearchBox(input);
  //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  //   map.addListener('bounds_changed', function() {
  //     searchBox.setBounds(map.getBounds());
  //   });
  //   let markers = [];
  //   // Listen for the event fired when the user selects a prediction and retrieve
  //   // more details for that place.
  //   searchBox.addListener('places_changed', function() {
  //     let places = searchBox.getPlaces();
  //     if (places.length == 0) {
  //       return;
  //     }
  //     // Clear out the old markers.
  //     markers.forEach(function(marker) {
  //       marker.setMap(null);
  //     });
  //     markers = [];
  //     // For each place, get the icon, name and location.
  //     let bounds = new google.maps.LatLngBounds();
  //     places.forEach(function(place) {
  //       if (!place.geometry) {
  //         console.log("Returned place contains no geometry");
  //         return;
  //       }
  //       let icon = {
  //         url: place.icon,
  //         size: new google.maps.Size(71, 71),
  //         origin: new google.maps.Point(0, 0),
  //         anchor: new google.maps.Point(17, 34),
  //         scaledSize: new google.maps.Size(25, 25)
  //       };
  //       // Create a marker for each place.
  //       markers.push(new google.maps.Marker({
  //         map: map,
  //         title: place.name,
  //         position: place.geometry.location
  //       }));
  //       if (place.geometry.viewport) {
  //         // Only geocodes have viewport.
  //         bounds.union(place.geometry.viewport);
  //       } else {
  //         bounds.extend(place.geometry.location);
  //       }
  //     });
  //     map.fitBounds(bounds);
  //   });
  // }
  ///////////////////////////////////////////////////

  //Create Map
  // addMap(lat, long) {
  //   let latLng = new google.maps.LatLng(lat, long);
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 15,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //   this.addMarker();
  // }
  ///////////////////////////////////////////////////

  //Add Markers and Info Windows to the Map
  private addMarker(map) {
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
  // ///////////////////////////////////////////////////
  // // Current Location
  // getUserPosition() {
  //   this.options = {
  //     enableHighAccuracy: false
  //   };
  //   this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
  //     this.currentPos = pos;
  //     console.log(pos);
  //     this.addMap(pos.coords.latitude, pos.coords.longitude);
  //   }, (err: PositionError) => {
  //     console.log("error : " + err.message);
  //     ;
  //   })
  // }

  /////// /.Current Location //////////////

}
