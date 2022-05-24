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
          carouselWidth="1000px"
          carouselHeight="300px"
          slidesAmount="3"
          contentWidth="200px"
          contentHeight="200px"
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

//
