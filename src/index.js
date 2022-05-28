//example of using carousel component
import React from "react";
import ReactDOM from "react-dom";
import Carousel from "./Carousel.component";
import carouselData from "./data/carouselData";
import "./index.styles.scss";
class App extends React.Component {
  render() {
    return (
      <div id="component-container">
        <Carousel
          contents={carouselData}
          carouselWidth="1000"  //optional, default = user screen width
          carouselHeight="300"  //optional, default = 300px
          slidesAmount="3"      //optional , default = 3 items
          contentWidth="200"    //optional, default = 100%
          contentHeight="200"   //optional, default = auto
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

//
