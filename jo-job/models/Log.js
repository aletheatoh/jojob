var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var logSchema = new Schema({
  name: String,
  boxes: Number,
  moveIn: String,
  moveOut: String
});

module.exports = mongoose.model('Log', logSchema);
