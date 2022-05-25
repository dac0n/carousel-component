export const getStyles = (
  //fallback values in case they are not set
  carouselWidth = calc(document.body.clientWidth - 100),
  carouselHeight = 300,
  slidesAmount = 3,
  contentWidth = "100%",
  contentHeight = "auto",
  carouselDataLength
) => {
  let [__carouselWidth, __slideWidth, __contentWidth, __scrollLimit] = Object.values(calculateWidths(
    carouselWidth,
    slidesAmount,
    contentWidth,
    carouselDataLength
  ));

  return {
    content_Height: contentHeight,
    carousel_Height: carouselHeight, //these values stays unchanged
    slides_Amount: slidesAmount,

    content_Width: __contentWidth,
    carousel_Width: __carouselWidth, //these values changes on window resize
    slide_Width: __slideWidth,
    scroll_Limit: __scrollLimit
  };
};

export const calculateWidths = (carouselWidth, slidesAmount, contentWidth, carouselDataLength) => {
  let __carouselWidth = Math.min(
    carouselWidth - 100,
    document.body.clientWidth - 100
  );
  //the line above changes specified width to a screen width if carousel can't fit
  let __slideWidth = __carouselWidth / slidesAmount;
  if (__slideWidth % 1 != 0) {
    //if not whole number
    __slideWidth = Math.floor(__slideWidth);
    __carouselWidth = __slideWidth * slidesAmount;
  }
  /* since i need exact values for my loop checker, i need to ensure
  that carousel width is equal to slide width times slides amount.
  the operations above fixes the JS floating point issue */

  let scrollLimit = (carouselDataLength - slidesAmount) * __slideWidth;


  let __contentWidth =
    __contentWidth > __slideWidth && __contentWidth !== "100%"
      ? __slideWidth
      : contentWidth;
  //in case of very small screens
  console.log( (carouselDataLength - slidesAmount) * __slideWidth);

  return {
    carousel_Width: __carouselWidth,
    slide_Width: __slideWidth,
    content_Width: __contentWidth,
    scroll_Limit: scrollLimit
  };
};
