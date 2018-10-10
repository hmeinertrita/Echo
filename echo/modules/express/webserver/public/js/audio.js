var audioElement;
var contextClass = (window.AudioContext || window.webkitAudioContext);
var audioContext = new contextClass();
var source;
var audioBuffer;
var analyzer;
var frequencyData = new Uint8Array(1024);

//GET FILE
$(document).ready(() => {
  var input = $('#input');
  input.on('change', function() {
    audioElement = new Audio();
    audioElement.src = URL.createObjectURL($(this).get(0).files[0]);
    source = audioContext.createMediaElementSource(audioElement);
  });
});
//AUDIO VISUALIZATION
function createAnalyser() {
  analyser = audioContext.createAnalyser();
}
function connectAnalyser(source) {
  //connect to source
  source.connect(analyser);
  //pipe to speakers
  analyser.connect(audioContext.destination);
}
function playSound() {
  //passing in file
  //source.buffer = audioBuffer;
  createAnalyser();
  //creating source node
  connectAnalyser(source);
  //start playing
  audioElement.play();
  update();
}

//Visualizer

function update() {
  //constantly getting feedback from data
  window.requestAnimationFrame(update);
  analyser.getByteFrequencyData(frequencyData);
  for (var i = 0; i < 4; i++) {
    const key = i*128;
    updateVertex(frequencyData[key]/4, i);
  }
}
