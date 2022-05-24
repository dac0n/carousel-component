export default (
  carouselWidth = calc(document.body.clientWidth - 100),
  carouselHeight = "300px",
  slidesAmount = 3,
  contentWidth = "100%",
  contentHeight = "auto"
) => {

    let __carouselWidth = Math.min((parseInt(carouselWidth, 10)-100), (document.body.clientWidth - 100));
    let __contentWidth = parseInt(contentWidth, 10);
    let __contentHeight = parseInt(contentHeight, 10);
    //the line above changes specified width to a screen width if carousel can't fit
    let __slideWidth = __carouselWidth / slidesAmount;
    if (__slideWidth % 1 != 0){ //if not whole number
      __slideWidth = Math.floor(__slideWidth);
      __carouselWidth = __slideWidth * slidesAmount ; 
    }
    if (__contentWidth > __slideWidth) { //in case of very small screens
      __contentWidth = __slideWidth;
      console.log({__contentHeight, __contentWidth})
    } 

    /* since i need exact values for my loop checker, i need to ensure
    that carousel width is equal to slide width times slides amount.
    the operations above fixes the JS floating point problem */


  return {
    carousel_Width: __carouselWidth,
    carousel_Height: carouselHeight,
    content_Width: __contentWidth,
    content_Height: __contentHeight,
    slides_Amount: parseInt(slidesAmount, 10),
    slide_Width: __slideWidth,
  };
};



/*   let carouselWidth = "1000px" || availableSpace;
  const carouselHeight = "400px" || "300px";
  const slidesAmount = 4; //add parseint
  const contentWidth = "200px"; //optional
  const contentHeight = "200px"; //optional */

  /* ------------------------------------------------- 
note that navigation buttons add 50px to sides
and slider input adds 40px to bottom of component
example - carousel  width: 800px,  carousel  height: 300px
          component width: 900px,  component height: 340px        
*/