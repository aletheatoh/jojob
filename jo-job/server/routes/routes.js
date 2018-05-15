var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();
var bodyParser = require('body-parser');
var Log = require('../../models/Log');
var TotalCost = require('../../models/TotalCost');

router.get('/', function(req, res){
  res.render('index')
});

router.get('/sparefoot', function(req, res){

  var url = 'https://www.sparefoot.com/search.html?location=Durham+NC?searchType=storage';

  // url = 'https://www.sparefoot.com/search.html?location=Charlotte+NC&searchType=storage&order=price&page=1&sqft=87-125&listingsPerPage=15';

  if (req.query.order != undefined) {
    url += `&order=${req.query.order}`;
  }

  if (req.query.unit_size != undefined) {
    url += `&sqft=${req.query.unit_size}`;
  }

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var json = { results : []};

      $('.facility-list-card').each(function(){
        var obj = {};
        var data = $(this);

        // get name, address and distance div
        name = data.find('h4').text();
        obj['name'] = name;

        address = data.find('.street').text() + data.find('.city').text() + data.find('.state').text() + data.find('.zip').text();
        obj['address'] = address;

        distance = data.find('div.location-info > span:nth-child(2)').text();
        obj['distance'] = distance;

        contact = data.find('.facility-phone').first().text();
        obj['contact'] = contact;

        // more than one promotion
        promotion = data.find('span.unit-promotion').first().text();
        obj['promotion'] = promotion;

        price = data.find('span.price').first().text();
        // price = $('div.unit-price').text();
        obj['price'] = price;

        reviews = data.find('.review-count').first().text();
        obj['reviews'] = reviews;

        // find image
        image = data.find('span.ph-image-wrapper > img').attr('src');
        obj['image'] = image;

        link = 'https://www.sparefoot.com' + data.find('a').first().attr('href');
        obj['link'] = link;

        json.results.push(obj);
      })

      res.send(json);
    }

  });
})

router.get('/uhaul', function(req, res){

  // var url = req.body.url;

  var url = 'https://www.uhaul.com/ReservationsMVC/RatesTrucks/';


  request(url, function(error, response, html){
    var elem;

    if(!error){
      var $ = cheerio.load(html);
      var json = { results : []};

      elem = $('h3').first().html();
      console.log($.html())

      $('#equipmentList > li').each(function(item, idx){

        var obj = {};
        var data = $(this);
        // console.log(data.html());

        // get name, address and distance div
        truckType = data.find('h3').text();
        obj['truckType'] = truckType;

        json.results.push(obj);
      })

      res.send({result: elem});
    }
    else {
      console.log('error' + error)
    }

  });
})

router.route('/insert')
.post(function(req,res) {
  var log = new Log();
  log.name = req.body.name;
  log.boxes = req.body.boxes;
  log.moveIn = req.body.moveIn;
  log.moveOut = req.body.moveOut;
  log.contribution = 0; // let's initilize as 0 first
  log.save(function(err) {
    if (err) res.send(err);

    // update contributions here
    TotalCost.find({}, function(err, costs) {
      if (err) res.send("error " + err);

      var totalCost = costs[0].total;
      // update distributed contributions
      Log.count({}, function (err, count) {

        var numPeople = count;
        var contribution = parseFloat(totalCost) / numPeople;

        // Log.updateMany({}, {$set: {contribution: req.body.total / numPeople}})
        Log.updateMany({}, {
          $set: {
            contribution: contribution
          }
        }, {
          multi: true
        },
        function(err, result) {
          if (err) res.send("error " + err);

          res.send('Log successfully added!');
        })
      });
    });
  });
})

// add a new total cost
router.route('/addCost')
.post(function(req,res) {
  // first remove all previous costs
  TotalCost.remove({}, function(err, cost) {
    if (err)
    res.send(err);

    // then replace with new cost
    var totalCost = new TotalCost();
    totalCost.total = req.body.total;
    totalCost.storage = req.body.storage;
    totalCost.truck = 0;

    // update distributed contributions
    Log.count({}, function (err, count) {

      var numPeople = count;
      var contribution = parseFloat(req.body.total) / numPeople;

      // Log.updateMany({}, {$set: {contribution: req.body.total / numPeople}})
      Log.updateMany({}, {
        $set: {
          contribution: contribution
        }
      }, {
        multi: true
      },
      function(err, result) {
        console.log(result);
        console.log(err);

        totalCost.save(function(err) {
          if (err)
          res.send(err);
          res.send('Total Cost successfully added!');
        });
      })
    });
  });
})

// get the total cost
router.get('/getCost',function(req, res) {
  TotalCost.find({}, function(err, cost) {
    if (err)
    res.send(err);
    res.json(cost);
  });
});

router.route('/update')
.post(function(req, res) {
  const doc = {
    name: req.body.name,
    boxes: req.body.boxes,
    moveIn: req.body.moveIn,
    moveOut: req.body.moveOut,
    contribution: req.body.contribution,
  };
  console.log(doc);
  Log.update({_id: req.body._id}, doc, function(err, result) {
    if (err)
    res.send(err);
    res.send('Log successfully updated!');
  });
});

router.get('/delete', function(req, res){
  var id = req.query.id;
  Log.find({_id: id}).remove().exec(function(err, log) {
    if(err)
    res.send("error " + err)
    res.send('Log successfully deleted!');
  })
});

router.get('/getAll',function(req, res) {
  Log.find({}, function(err, logs) {
    if (err)
    res.send(err);
    res.json(logs);
  });
});

module.exports = router;
