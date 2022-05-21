import React, { Component } from "react";
import arrowLeft from "./upload/left-squared.png";
import arrowRight from "./upload/right-squared.png";
import vars from "../../data/_variables.module.scss"
import "./Carousel.styles.scss";



class Carousel extends Component {
  constructor(props) {
    super(props);
    this.slideWidth = vars.slideWidth.slice(0, -2), //remove "px"
      this.state = {
        carouselData: props.contents,
        mouseDown: false,
        prevPosition: 0,    //we will use that to remember and compare mouse / touch values
        slideInput: null,
      };
    this.carouselContentEl = React.createRef();
  }

  componentDidMount = () => {
    document.querySelectorAll(".carousel-slide > * ").forEach(slideContent => slideContent.draggable = false);
    //line above allows interaction with slide contents (text, video) while not breaking cursor drag navigation
    document.getElementById('carousel-slide-input').placeholder = `1 ... ${this.state.carouselData.length}`;
    this.setState({ scrollLimit: (this.state.carouselData.length - vars.slidesAmount) * this.slideWidth });
    //adding it here since calculation requires variables from state
  }


  changeItem = (direction) => {
    let scrollObject = this.adjustIfLoop(this.carouselContentEl.current.scrollLeft, this.carouselContentEl.current.scrollLeft + direction, 'button')
    this.carouselContentEl.current.scrollTo(scrollObject);
    this.adjustScroll(this.carouselContentEl.current.scrollLeft, (direction > 0 ? true : false));
    //line above fixes imprecise scrollTo values when button pressed in a middle of animation
  }


  trackMouse = e => {
    if (this.state.prevPosition) {
      let delta = (e.clientX - this.state.prevPosition);
      if (Math.abs(delta) > 5) {     //we don't want to call setState after each pixel but its possible if performance is not a problem
        let nextScrollVal = e.currentTarget.scrollLeft - delta;
        let scrollObject = this.adjustIfLoop(e.currentTarget.scrollLeft, nextScrollVal, 'touch');
        e.currentTarget.scrollTo(scrollObject);
        this.setState({ prevPosition: this.state.prevPosition + delta });
        delta = 0;
      }
    }
  }

  pressHandler = e => {
    this.carouselContentEl.current.style.scrollSnapType = '';
    //to ensure we don't use snap which effectively disables scrolling for mouse
    this.setState({
      prevPosition: e.clientX,  //we will use this to scroll with mouse
      mouseInitialX: e.clientX  //this stays unchanged until release, needed for snapping for mouse users
    });
  }

  releaseHandler = e => {
    this.adjustScroll(e.currentTarget.scrollLeft, this.state.mouseInitialX > e.clientX);
    this.setState({ prevPosition: 0, mouseInitialX: 0 });
  }


  adjustScroll = (currentScroll, snapForward) => {
    let snappingValue = snapForward ? (this.slideWidth - currentScroll % this.slideWidth) : -(currentScroll % this.slideWidth);
    this.carouselContentEl.current.scrollTo({
      top: 0,
      left: currentScroll + snappingValue,
      behavior: 'smooth'
    })
  }


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
    if (e.currentTarget.scrollLeft == this.state.prevPosition) {
      e.currentTarget.scrollTo({
        top: 0,
        left: e.currentTarget.scrollLeft ? 0 : this.state.scrollLimit,
        behavior: 'smooth'
      })
    }
    this.setState({ prevPosition: 0 })
  }

  /* SLIDE NUMERICAL INPUT SUPPORT  */

  handleSlideSubmit(){
    event.preventDefault(); 

    let adjustedInput = 

    (this.state.slideInput < 1 ) ? 
    0 : (this.state.slideInput > (this.state.carouselData.length - vars.slidesAmount)) ? 
    this.state.carouselData.length - vars.slidesAmount : this.state.slideInput - 1;

    this.carouselContentEl.current.scrollTo({
      top: 0,
      left: adjustedInput*this.slideWidth,
      behavior: 'smooth'
    });  
  } 

  render() {
    return (
      <div className="carousel-wrapper">
        <div className="carousel-flex-container">
          <img
            onClick={() => { this.changeItem(-this.slideWidth) }}
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
            <div id="carousel-slides" className="flex-child" >
              {
                this.state.carouselData.map((element, i) => <div className="carousel-slide" key={i} >{element}</div>)
              }
            </div>
          </div>
          <img
            onClick={() => { this.changeItem(+this.slideWidth) }}
            src={arrowRight}
            className="navigation flex-child"
          />
        </div>
        <form className="slide-input-form" onSubmit={()=>{this.handleSlideSubmit()}}>
        <input id="carousel-slide-input" type="number" onChange={()=> {this.setState({slideInput: event.target.value})}} ></input>
        <input type="submit" value="Go!"/>
        </form>

      </div>
    );
  }
}

export default Carousel;