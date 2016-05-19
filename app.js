var path = require('path');
var express = require('express');
var shortid = require('shortid');
var http = require('http')
var mongoose = require('mongoose');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var randomColor = require('randomcolor');

var Room = require('./models/room.js');


var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';

mongoose.connect('mongodb://'+mongoHost+':'+mongoPort+'/draw2');

app.use(express.static('public'));

app.get('/', function(req, res){
	res.redirect('/'+shortid.generate());;
});

app.get('/:roomId', function(req, res){ 
  Room.findOne({id: req.params.roomId}, function(error, room){
    if(error)
      return console.error(error);
    if(!room){    // if a room with this id does not exist, create one and then send index.html
      var newRoom = new Room({
        id: req.params.roomId,
        circles: []
      });
      newRoom.save(function(err){
        if(err){
          res.send(err);
        }
        else{
          res.sendFile(path.join(__dirname, 'index.html'));
        }
      });
    }else{
      res.sendFile(path.join(__dirname, 'index.html'));
    }
  });
});

io.on('connection', function(socket){
  socket.emit('setColor', randomColor());

  socket.on('room', function(roomId){
    socket.join(roomId);  // joins the passed in room
    socket.roomId = roomId;
    Room.findOne({id: roomId}, function(error, room){
      for(var i = 0; i < room.circles.length; i++){   // send previously drawn circle data
        socket.emit('circle', room.circles[i]);
      }
    });
  });

  socket.on('circle', function(circleData){
    io.sockets.in(socket.roomId).emit('circle', circleData);
    Room.update({id: socket.roomId}, {$push: {circles: circleData}}, function(error, numAffected){});
  });

});

mongoose.connection.once('open', function(){
  console.log('mongodb://'+mongoHost+':'+mongoPort+'/draw2')
  server.listen(port, ip, function(){
    console.log('Server listening on http://'+ip+':'+port);
  });
});

