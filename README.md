# carousel-component

To use, install carousel component:

`npm install https://github.com/dac0n/carousel-component`;

2) include Carousel.component.jsx in your project; 

3) Use `<Carousel contents={carouselData}/>`, where carouselData is an array of any html contents. That's all!

OPTIONAL: 
You can change the carousel appearance by passing additional props into it. Supported props are:
carouselWidth = "number" where number equals to a total width of a component in px.
carouselHeight = "number" where number equals to a total height of a component in px.
slidesAmount = "number" where number equals to an amount of shown slides. 
contentWidth = "number" where number equals to a width of a html content, centered inside slide if it is smaller.
contentHeight = "number" where number equals to a height of a html content, centered inside slide if it is smaller. 

You can see the example of component use in index.js or at https://carousel-component-dac0n.vercel.app/
