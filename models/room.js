var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
  id: String,
  circles: [{
    prevCoords: {
      x: Number,
      y: Number
    },
    coords: {
      x: Number,
      y: Number 
    },
    color: String,
    radius: Number
  }]
});

module.exports = mongoose.model('Room', roomSchema);