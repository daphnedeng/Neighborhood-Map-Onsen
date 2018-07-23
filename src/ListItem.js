import React from "react";

class ListItem extends React.Component {

  render() {
    const { openInfoWindow, data } = this.props;

    return (
      <li
        role="link"
        className="placelist"
        tabIndex="0"
        onKeyPress={openInfoWindow.bind(
          this,
          data.marker
        )}
        onClick={openInfoWindow.bind(this, data.marker)}
      >
        {data.name}
      </li>
    );
  }
}

export default ListItem;
