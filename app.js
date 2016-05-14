var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket){
  socket.on('circle', function(coords){
    io.emit('circle', coords);
  });

});

http.listen(3000, function(){
	console.log('Server listening on localhost:3000');
});
