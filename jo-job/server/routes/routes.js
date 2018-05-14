var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var router = express.Router();
var bodyParser = require('body-parser');
var Log = require('../../models/Log');

router.get('/', function(req, res){
  res.render('index')
});

router.get('/scrape', function(req, res){

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

router.route('/insert')
.post(function(req,res) {
  var log = new Log();
  log.name = req.body.name;
  log.boxes = req.body.boxes;
  log.moveIn = req.body.moveIn;
  log.moveOut = req.body.moveOut;
  log.save(function(err) {
    if (err)
    res.send(err);
    res.send('Log successfully added!');
  });
})

router.route('/update')
.post(function(req, res) {
  const doc = {
    name: req.body.name,
    boxes: req.body.boxes,
    moveIn: req.body.moveIn,
    moveOut: req.body.moveOut,
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
  Log.find({_id: id}).remove().exec(function(err, expense) {
    if(err)
    res.send(err)
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
