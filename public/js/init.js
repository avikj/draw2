$(document).ready(function(){
  var socket = io();
  var canvas = document.getElementById('drawing-canvas');
  var ctx = canvas.getContext("2d");

  var mouseIsDown = false;

  socket.on('circle', function(coords){
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000000';
    ctx.fill();
  });

  canvas.addEventListener('mousedown', function(event){
    socket.emit('circle', fixCoords(event));
    mouseIsDown = true;
  });

  canvas.addEventListener('mouseup', function(event){
    mouseIsDown = false;
  });

  canvas.addEventListener('mousemove', function(event){
    if(mouseIsDown){
      socket.emit('circle', fixCoords(event));
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
});
