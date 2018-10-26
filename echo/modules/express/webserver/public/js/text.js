var count = [0,0,0,0];
const socket = io();
$(document).ready(()=> {
  var input = $('#input');

  input.on('keyup', function(event){
    var keycode = (event.originalEvent.keyCode ? event.originalEvent.keyCode : event.originalEvent.which);

    //const index = keycode%4; //vertex depends on key pressed
    const index = Math.floor(Math.random()*4); //random vertex
    const minBump = 20;
    const multiplier = 0.5;
    const splashMultiplier = 1/3;
    const bump = keycode*multiplier > minBump ? keycode*multiplier : minBump;

    count[index] += bump;
    for (var i=0; i<4; i++) {
      if(i !== index) {
        count[i] += bump * splashMultiplier;
      }
    }
  });
});

function update() {
  window.requestAnimationFrame(update);
  for (var i = 0; i < 4; i++) {
    updateVertex(count[i], i);
    if (count[i] > 0) {
      var div = 20;
      var sub = count[i]/div>1 ? count[i]/div : 1;
      count[i]-=sub;
    }
    else if (count[i] < 0) {
      count[i]=0;
    }
  }
}

update();
