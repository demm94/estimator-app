// create a simple instance
// by default, it only adds horizontal recognizers

let myElement = document.body;

var mc = new Hammer(myElement);

// let the pan gesture support all directions.
// this will block the vertical scrolling on a touch-device while on the element
mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });

// listen to events...
mc.on("panleft panright panup pandown tap press", function(ev) {
    console.log(ev.type +" gesture detected.");
});