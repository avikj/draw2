$(document).ready(function(){
  var socket = io();
  var canvas = document.getElementById('drawing-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  var mouseIsDown = false;

  socket.on('circle', function(coords){
    drawCircle(coords);
  });

  canvas.addEventListener('mousedown', function(event){
    var fixedCoords = fixCoords(event);
    socket.emit('circle', fixedCoords);
    mouseIsDown = true;
    drawCircle(fixedCoords);
  });

  canvas.addEventListener('mouseup', function(event){
    mouseIsDown = false;
  });

  canvas.addEventListener('mousemove', function(event){
    if(mouseIsDown){
      var fixedCoords = fixCoords(event);
      socket.emit('circle', fixedCoords);
      drawCircle(fixedCoords);
    }
  });

  function fixCoords(e){
    var x;
    var y;
    if (e.pageX || e.pageY) { 
      x = e.pageX;
      y = e.pageY;
    }
    else { 
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return {x: x, y: y};
  }

  function drawCircle(coords){
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
  }
});
