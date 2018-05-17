var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var totalCostSchema = new Schema({
  total: Number,
  storage: Number,
  unitSize: String,
  truck: Number,
  truckType: String
});

module.exports = mongoose.model('TotalCost', totalCostSchema);
