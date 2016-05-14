$(document).ready(function(){
  var socket = io();
  var canvas = document.getElementById('drawing-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  var color = '#000000';

  var mouseIsDown = false;

  socket.on('circle', function(data){
    drawCircle(data);
  });
  socket.on('setColor', function(newColor){
    color = newColor;
  });

  canvas.addEventListener('mousedown', function(event){
    var circleData = getCircleData(event);
    socket.emit('circle', circleData);
    mouseIsDown = true;
    drawCircle(circleData);
  });

  canvas.addEventListener('mouseup', function(event){
    mouseIsDown = false;
  });

  canvas.addEventListener('mousemove', function(event){
    if(mouseIsDown){
      var circleData = getCircleData(event);
      socket.emit('circle', circleData);
      drawCircle(circleData);
    }
  });

  function getCircleData(e){
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
    return {x: x, y: y, color: color};
  }

  function drawCircle(circleData){
    ctx.beginPath();
    ctx.fillStyle = circleData.color;
    ctx.arc(circleData.x, circleData.y, 4, 0, 2 * Math.PI, false);
    ctx.fill();
  }
});
