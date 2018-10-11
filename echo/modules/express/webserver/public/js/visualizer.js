const edgeLength = 100;
const toRad = Math.PI/180;
const vertexCount = 4;
const edgeCount = 3;
const edgeBaseAngle = 360/edgeCount*toRad;
const edgeCircumRadius = 0.5*edgeLength/Math.sin(0.5*edgeBaseAngle);
const edgeInRadius = 0.5*edgeLength/Math.tan(0.5*edgeBaseAngle);
const edgeAngle = Math.asin(edgeCircumRadius/edgeLength);
const cubeEdgeLength = edgeLength/Math.sqrt(2);
const faceHeight = edgeInRadius + edgeCircumRadius;
const faceInRadius = edgeCircumRadius*Math.tan(Math.asin(edgeInRadius/faceHeight));
const faceCircumRadius = Math.sqrt(Math.pow(faceInRadius,2) + Math.pow(edgeCircumRadius, 2));

function setEdgeLength(addedLength, vertex) {
  const height = faceCircumRadius + faceInRadius + addedLength;
  const length = Math.sqrt(Math.pow(edgeCircumRadius,2) + Math.pow(height,2));

  $('.vertex__'+vertex+':not(.base) .edge').css('--length',length+'px');
}

function setEdgeAngle(addedLength, vertex) {
  const height = faceCircumRadius + faceInRadius + addedLength;
  const angle =(1/2)*Math.PI + Math.atan(edgeCircumRadius/height);
  $('.vertex__'+vertex+':not(.base) .edge').css('--angle',angle+'rad');
}

function setVertexTranslate(addedLength, vertex) {
  const height = faceCircumRadius + addedLength;
  $('.vertex__'+vertex+':not(.base)').css('--translate',height+'px');
}

function updateVertex(addedLength, vertex) {
  setEdgeLength(addedLength, vertex);
  setEdgeAngle(addedLength, vertex);
  setVertexTranslate(addedLength, vertex);
}

function createPolyhedron(vertices, sides, ...classes) {
  const classString = classes.join(' ');
  const poly = $('<div class="polyhedron '+classString+'">')
  for (var i=0; i<vertices; i++) {
    var vertex = $('<div class="vertex vertex__'+i+' '+classString+'">');
    for (var j=0; j<sides; j++) {
      vertex.append($('<div class="edge edge__'+j+' '+classString+'">'));
    }
    poly.append(vertex);
  }
  return poly;
}

$(document).ready(() => {
  const visualizer = $('#visualizer');
  visualizer.append(createPolyhedron(vertexCount, edgeCount, 'base'));
  visualizer.append(createPolyhedron(vertexCount, edgeCount));
});
