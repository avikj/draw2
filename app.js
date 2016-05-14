var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var randomColor = require('randomcolor');

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket){
  socket.emit('setColor', randomColor());
  socket.on('circle', function(circleData){
    io.emit('circle', circleData);
  });

});

http.listen(port, ip, function(){
	console.log('Server listening on localhost:3000');
});
