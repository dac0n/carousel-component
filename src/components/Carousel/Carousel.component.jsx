import React, { Component } from "react";
import arrowLeft from "./upload/left-squared.png";
import arrowRight from "./upload/right-squared.png";
import "./Carousel.styles.scss";

import getStyles from "./utils/styles_calc";


class Carousel extends Component {
  constructor(props) {
    super(props);


    this.styles = getStyles(props.carouselWidth, props.carouselHeight, props.slidesAmount, props.contentWidth, props.contentHeight);
    this.state = {
      carouselData: props.contents,
      mouseDown: false,
      prevPosition: 0,    //we will use that to remember and compare mouse / touch values
      slideInput: null,
    };
    this.carouselContentEl = React.createRef();
    this.carouselSlideInput = React.createRef();
  }

  componentDidMount = () => { //all these things require loaded DOM
    this.carouselContentEl.current.querySelectorAll(".carousel-slide > * ").forEach(slideContent => {
      slideContent.draggable = false; 
      slideContent.width = this.styles.content_Width;  
      slideContent.height = this.styles.content_Height; 
      // we need the block above because we don't have access to slideContent before DOM loaded / at render section
/* 
            if (slideContent.nodeName ) {
              slideContent.parentNode.style.alignItems = 'center';
            } */


    });
    this.carouselSlideInput.current.placeholder = `1 ... ${this.state.carouselData.length}`;
    this.setState({ scrollLimit: (this.state.carouselData.length - this.styles.slides_Amount) * this.styles.slide_Width });
    //adding it here since calculation requires variables from state
  }

  /* LEFT/RIGHT BUTTONS NAVIGATION */

  changeItem = (direction) => {
    let scrollObject = this.adjustIfLoop(this.carouselContentEl.current.scrollLeft, this.carouselContentEl.current.scrollLeft + direction, 'button')
    this.carouselContentEl.current.scrollTo(scrollObject);
    this.adjustScroll(this.carouselContentEl.current.scrollLeft, (direction > 0 ? true : false));
    //line above fixes imprecise scrollTo values when button pressed in a middle of animation
  }



  /* MOUSE FOLLOWING SLIDER */

  pressHandler = e => {
    this.carouselContentEl.current.style.scrollSnapType = '';
    //to ensure we don't use snap which effectively disables scrolling for mouse
    this.setState({
      prevPosition: e.clientX,  //we will use this to scroll with mouse
      mouseInitialX: e.clientX  //this stays unchanged until release, needed for snapping for mouse users
    });
  }

  trackMouse = e => {
    /* usually prevPosition is 0, so this does nothing. but when the mouse is pressed, prevPosition exists and carousel is dragged with mouse */
    if (this.state.prevPosition) {
      let delta = (e.clientX - this.state.prevPosition);
      if (Math.abs(delta) > 5) {     // means we drag the carousel 5 pixels left/right if mouse moved to the same value
        //the value above can be changed to 1, but it will take 5 times more operations and can lead to performance issues on a slow devices
        let nextScrollVal = e.currentTarget.scrollLeft - delta;
        let scrollObject = this.adjustIfLoop(e.currentTarget.scrollLeft, nextScrollVal, 'touch');
        e.currentTarget.scrollTo(scrollObject);
        this.setState({ prevPosition: this.state.prevPosition + delta });
        delta = 0;
      }
    }
  }

  releaseHandler = e => {
    this.adjustScroll(e.currentTarget.scrollLeft, this.state.mouseInitialX > e.clientX);  //snaps to next closest slide
    this.setState({ prevPosition: 0, mouseInitialX: 0 });
  }



  /* SNAPPING */
  /* this function calculates the value missing to the next slide and scrolls the carousel to that value */

  adjustScroll = (currentScroll, snapForward) => {
    let snappingValue = snapForward ? (this.styles.slide_Width - currentScroll % this.styles.slide_Width) : -(currentScroll % this.styles.slide_Width);
    this.carouselContentEl.current.scrollTo({
      top: 0,
      left: currentScroll + snappingValue,
      behavior: 'smooth'
    })
  }

  /* INFINITE SCROLLING  */
  /* this function takes the scroll objects and modifies it to scroll to the first / last slide
  if thats necessary to loop the carousel */
  adjustIfLoop = (curr, next, type) => {
    if (curr == 0 && curr > next) {
      return {
        top: 0,
        left: this.state.scrollLimit,
        behavior: "smooth"
      }
    } else if (curr == this.state.scrollLimit && curr < next) {
      return {
        top: 0,
        left: 0,
        behavior: "smooth"
      }
    } else {
      return {
        top: 0,
        left: next,
        behavior: (type == 'touch' ? "instant" : "smooth")
      }
    }
  }


  /*  MOBILE SUPPORT  */

  touchStartHandler = e => {
    this.carouselContentEl.current.style.scrollSnapType = 'x mandatory';
    this.setState({ prevPosition: e.currentTarget.scrollLeft })
  }

  touchEndHandler = e => {
    /* i could move part of logic to adjustIfLoop function, but it would
    slower the app performance since it would cause to multiple additional
    "if" checks even when user uses non-touch devices */
    if (e.currentTarget.scrollLeft == this.state.prevPosition) {
      if (e.currentTarget.scrollLeft == 0 || e.currentTarget.scrollLeft == this.state.scrollLimit) {
        e.currentTarget.scrollTo({
          top: 0,
          left: e.currentTarget.scrollLeft ? 0 : this.state.scrollLimit,
          behavior: 'smooth'
        })
      }
    }
    this.setState({ prevPosition: 0 })
  }

  /* SLIDE NUMERICAL INPUT SUPPORT  */

  handleSlideSubmit() {
    event.preventDefault();
    //expression below secures that user cannot select non-existing slide or move carousel out of boundaries
    let adjustedInput =
      (this.state.slideInput < 1) ?
        0 : (this.state.slideInput > (this.state.carouselData.length - this.styles.slides_Amount)) ?
          this.state.carouselData.length - this.styles.slides_Amount : this.state.slideInput - 1;

    this.carouselContentEl.current.scrollTo({
      top: 0,
      left: adjustedInput * this.styles.slide_Width,
      behavior: 'smooth'
    });
  }

  /*              RENDERING               */

  render() {
    const carouselSizes = {
      width: this.styles.carousel_Width + 'px',
      height: this.styles.carousel_Height
    };
    const slideSizes = {
      minWidth: this.styles.slide_Width,
      maxWidth: this.styles.slide_Width
    };
    const contentSizes = {
      width: this.styles.content_Width, 
      height: this.styles.content_Height
    }
    return (
      <div className="carousel-wrapper">
        <div className="carousel-flex-container">
          <img
            onClick={() => { this.changeItem(-this.styles.slide_Width) }}
            src={arrowLeft}
            className="navigation flex-child"
          />
          <div id="carousel-content"
            onMouseMove={this.trackMouse}
            onMouseDown={this.pressHandler}
            onMouseLeave={this.releaseHandler}
            onMouseUp={this.releaseHandler}
            onTouchStart={this.touchStartHandler}
            onTouchEnd={this.touchEndHandler}
            ref={this.carouselContentEl}
          >
            <div id="carousel-slides" style={carouselSizes} className="flex-child" >
              {
                this.state.carouselData.map((element, i) => {
                  return <div className="carousel-slide" key={i} style={slideSizes}>{element}</div>
                })
              }
            </div>
          </div>
          <img
            onClick={() => { this.changeItem(+this.styles.slide_Width) }}
            src={arrowRight}
            className="navigation flex-child"
          />
        </div>
        <form className="slide-input-form" onSubmit={() => { this.handleSlideSubmit() }}>
          <input id="carousel-slide-input" type="number" ref={this.carouselSlideInput} onChange={() => { this.setState({ slideInput: event.target.value }) }} ></input>
          <input type="submit" value="Go!" />
        </form>

      </div>
    );
  }
}

export default Carousel;