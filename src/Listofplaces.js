import React, { Component } from "react";
import ListItem from "./ListItem";

class Listview extends Component {
    state = {
        locations: "",
        query: "",
        showplace: true
    }
  
    //use .toLowerCase() to filter
    //https://www.youtube.com/watch?v=RM_nXOyHwN0&feature=youtu.be
    filterLocations = (event) => {
        this.props.closeInfoWindow();
        let { value } = event.target;
        let locations = [];
        this.props.locations.forEach((location) => {
            if (location.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
            //show the marker that match
            location.marker.setVisible(true);
            locations.push(location);
        } else {
            //hide the marker if nothing match
            location.marker.setVisible(false);
        }
    });
        this.setState({
            locations: locations,
            query: value
        });
    }

  componentWillMount() {
    this.setState({
      locations: this.props.locations
    });
  }

  // Render function for LocationList
  render() {
    
    const { showplace, locations, query } = this.state;
    const { openInfoWindow } = this.props;

    let locationlist = locations.map((listItem, index) => {
      return (
        <ListItem
          key={index}
          openInfoWindow={openInfoWindow}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-box">
        <input
          role="search"
          aria-labelledby="filter"
          className="searchbar"
          type="text"
          placeholder="Enter place name"
          value={query}
          onChange={this.filterLocations}
        />
        <ul>
          {showplace && locationlist}
        </ul>
      </div>
    );
  }
}

export default Listview;
