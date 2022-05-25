import React from "react";
import ReactDOM from "react-dom";
import Carousel from "./components/Carousel/Carousel.component";
import carouselData from "./data/carouselData";
import "./index.styles.scss";
class App extends React.Component {
  render() {
    return (
      <div id="component-container">
        <Carousel
          contents={carouselData}
          carouselWidth="1000"
          carouselHeight="300"
          slidesAmount="3"
          contentWidth="200"
          contentHeight="200"
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

//
