var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var totalCostSchema = new Schema({
  total: Number,
  storage: Number,
  truck: Number
});

module.exports = mongoose.model('TotalCost', totalCostSchema);
