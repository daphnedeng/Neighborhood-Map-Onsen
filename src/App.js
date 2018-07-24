import React, { Component } from 'react';
import Listofplaces from './Listofplaces';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //local json file
      locations: require("./locations.json"),
      map: "",
      infowindow: "",
      oldmarker: ""
    };

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
    //use .bind so every element can call the same function
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {
    window.initMap = this.initMap;
    onScriptLoad('https://maps.googleapis.com/maps/api/js?key=AIzaSyB4YAvdO8Jt8DwnLh5hHbfOeZ4qAtL7QMs&callback=initMap&onerror=googleError()')
  }

  //render map once the google map script is loaded
  initMap() {
    let self = this;
    let mapContainer = document.getElementById("map");
    mapContainer.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapContainer, {
      center: { lat: 43.293041, lng: 142.691534 },
      zoom: 8,
    });

    let InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    let locations = [];
    //.map() will render all markers on google map
    this.state.locations.map((location) => {
      let name = location.name;
      let marker = new window.google.maps.Marker({
        name: location.name,
        website: location.website,
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfoWindow(marker);
      });

      location.name = name;
      location.marker = marker;
      location.display = true;
      locations.push(location);
    });
    this.setState({
      locations: locations
    });
  }

  // Open the infowindow for the marker
  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      oldmarker: marker
    });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, 30);
    this.getMarkerInfo(marker);
  }

  //Retrive weather data
  //   fetch('http://api.openweathermap.org/data/2.5/weather?q=japan&appid=0703e720c97e2c307748337e321a2475&imperial=fehrenheit&units=metric')
  //     .then(response => {
  //       return response.json();
  //     }).then(myJson => {
  //     console.log(myJson)
  // })
  getMarkerInfo(marker) {
    let self = this;
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${marker.getPosition().lat()}&lon=${marker.getPosition().lng()}&appid=0703e720c97e2c307748337e321a2475&imperial=fehrenheit&units=metric`)
      .then(function(response) {
        //if something happen (like api key expires)
        if (response.status !== 200) {
          self.state.infowindow.setContent("Weather Info is not available");
          return;
        }
        // Get the text in the response
        response.json().then(function(myJson) {
          console.log(myJson);
          
          let city = myJson.name; //place's name
          let temp = myJson.main.temp; //19.42
          let sky = myJson.weather[0].description; //sky something

          self.state.infowindow.setContent(
            `<h1>${marker.name}</h1><br>` + 
            `<h3><a href=${marker.website}>${marker.website}</a><h3><br>` + 
            `<p>Current temperature<br> in ${city} is ${temp} &#8457;<br> ${sky}.<p>`
            //e.g Asahidake Onsen, homepage, current temperature in Kamikawa is 12.8 ℉, scattered clouds
          );
        });
      })
      .catch(function(err) {
        self.state.infowindow.setContent("Weather Info is not available");
      });
  }

  // Close the info window
  closeInfoWindow() {
    if (this.state.oldmarker) {
      this.state.oldmarker.setAnimation(null);
    }
    this.setState({
      oldmarker: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div className="main">
        <Listofplaces
          key='map'
          locations={this.state.locations}
          openInfoWindow={this.openInfoWindow}
          closeInfoWindow={this.closeInfoWindow}
        />
        <div id="map" />
      </div>
    );
  }
}

export default App;

//make sure load google map asynchronously http://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
function onScriptLoad(src) {
  let x = window.document.getElementsByTagName("script")[0];
  let s = window.document.createElement("script");
  s.type = 'text/javascript';
  s.src = src;
  s.async = true;
  s.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  x.parentNode.insertBefore(s, x);
}