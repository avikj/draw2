$(document).ready(function(){
  var socket = io();
  var canvas = document.getElementById('drawing-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");
  var CIRCLE_RAD = 2;
  ctx.lineWidth = CIRCLE_RAD*2;
  var color = '#000000';
  var prevCoords;
  var mouseState = 0; // 0 = up, 1 = left, 2 = right
  var users = {};


  socket.on('circle', function(data){
    draw(data);
  });
  socket.on('setColor', function(newColor){
    color = newColor;
  });

  canvas.addEventListener('mousedown', function(event){
    mouseState = Math.floor(event.button/2)+1;
    var circleData = getCircleData(event);
    socket.emit('circle', circleData);
    draw(circleData);
    prevCoords = circleData.coords;
  }, false);

  canvas.addEventListener('mouseup', function(event){
    prevCoords = null;
    mouseState = 0;
  }, false);

  canvas.addEventListener('mouseout', function(event){
    prevCoords = null;
    mouseState = 0;
  }, false);

  canvas.addEventListener('mousemove', function(event){
    if(mouseState > 0){
      var circleData = getCircleData(event);
      socket.emit('circle', circleData);
      draw(circleData);
      prevCoords = circleData.coords;
    }
  }, false);

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
    return {
      prevCoords: prevCoords,
      coords: {
        x: x, 
        y: y
      },
      color: mouseState == 1 ? color : '#ffffff',
      radius: mouseState == 1 ? CIRCLE_RAD : CIRCLE_RAD*10
    };
  }

  function draw(circleData){
    if(circleData.prevCoords){
      ctx.beginPath();
      ctx.strokeStyle = circleData.color;
      ctx.lineWidth = circleData.radius*2;
      ctx.moveTo(circleData.prevCoords.x, circleData.prevCoords.y);
      ctx.lineTo(circleData.coords.x, circleData.coords.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = circleData.color;
    ctx.arc(circleData.coords.x, circleData.coords.y, circleData.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }
});
