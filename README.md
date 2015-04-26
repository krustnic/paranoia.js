Simple and funny library that adds eyes that follow your cursor. There are no dependencies. Checkout [demo](https://krustnic.github.io/paranoia.js)

Usage:

```javascript
// Check that all images loaded
$(window).load(function() {
    ParanoiaJS.add( "#img1", {
        x : 60,
        y : 30,   
        size : 100,
        appleSize : 20,
        color : "#FFFFFF"
    } );        

    ParanoiaJS.add( "#img1", {
        x : 115,
        y : 30,
        size : 100,
        appleSize : 20,
        color : "#FFFFFF"
    } );        
});

```

This code adds two eyes at positions (60, 30) and (115, 30) relative to element with selector "#img1". Eye size is set to 100, eye fill color is "#FFFFFF" and size of apple of the eye is 20.