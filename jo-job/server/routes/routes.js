var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var puppeteer = require('puppeteer');

var router = express.Router();
var bodyParser = require('body-parser');
var Log = require('../../models/Log');
var TotalCost = require('../../models/TotalCost');

router.get('/', function(req, res){
  res.render('index')
});

router.get('/sparefoot', function(req, res){

  var url = 'https://www.sparefoot.com/search.html?location=Durham+NC?searchType=storage';

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

router.get('/uhaul', async function(req, res){

  // const pickUp = req.query.pickup;
  // console.log('pickup is' + req.query.pickup);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.uhaul.com/', {waitUntil: 'networkidle2'});

  // dom element selectors
  const PICKUPLOCATION_SELECTOR = '#PickupLocation-TruckOnly';
  // const DROPOFFLOCATION_SELECTOR = '#DropoffLocation-TruckOnly';
  const PICKUPDATE_SELECTOR = '#PickupDate-TruckOnly';
  const PICKUPTIME_SELECTOR = '#PickupTime-TruckOnly';
  const BUTTON_SELECTOR = 'button.button-confirm';

  await page.click(PICKUPLOCATION_SELECTOR);
  await page.keyboard.type('Durham, NC');

  // await page.click(PICKUPDATE_SELECTOR);
  await page.evaluate((sel) => {
        return document.querySelector(sel).value = '6/6/2018';
      }, PICKUPDATE_SELECTOR);

  await page.click(PICKUPTIME_SELECTOR);
  await page.select(PICKUPTIME_SELECTOR, '7');

  await page.click(BUTTON_SELECTOR);

  // await page.waitForNavigation();

  await page.waitFor(6*1000);

  const LIST_TRUCKTYPE_SELECTOR = '#equipmentList > li.divider';
  let listLength = await page.evaluate((sel) => {
    return document.querySelectorAll(sel).length;
  }, LIST_TRUCKTYPE_SELECTOR);

  const TRUCKTYPE_SELECTOR = '#equipmentList > li:nth-child(INDEX) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h3';
  const SUITABLEFOR_SELECTOR = '#equipmentList > li:nth-child(INDEX) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > h4';
  const PRICE_SELECTOR = '#equipmentList > li:nth-child(INDEX) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div.text-right > dl > dd > div:nth-child(1)';
  const MILECHARGE_SELECTOR = '#equipmentList > li:nth-child(INDEX) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > form:nth-child(1) > div:nth-child(1) > div.text-right > dl > dd > div:nth-child(2)';

  var json = {
    results: []
  };

  for (let i = 1; i <= (listLength + 1); i++) {

    var result = {};

    // change the index to the next child
    let truckTypeSelector = TRUCKTYPE_SELECTOR.replace("INDEX", i);
    let suitableForSelector = SUITABLEFOR_SELECTOR.replace("INDEX", i);
    let priceSelector = PRICE_SELECTOR.replace("INDEX", i);
    let mileChargeSelector = MILECHARGE_SELECTOR.replace("INDEX", i);

    let truckType = await page.evaluate((sel) => {
          if (document.querySelector(sel) != null) {
            return document.querySelector(sel).innerText;
          }
          else {
            return 'None'
          }
        }, truckTypeSelector);

    let suitableFor = await page.evaluate((sel) => {
              if (document.querySelector(sel) != null) {
                return document.querySelector(sel).innerText;
              }
              else {
                return 'None'
              }
            }, suitableForSelector);

    let price = await page.evaluate((sel) => {
              if (document.querySelector(sel) != null) {
                return document.querySelector(sel).innerText;
              }
              else {
                return 'None'
              }
            }, priceSelector);

    let mileCharge = await page.evaluate((sel) => {
              if (document.querySelector(sel) != null) {
                return document.querySelector(sel).innerText;
              }
              else {
                return 'None'
              }
            }, mileChargeSelector);

    result['truckType'] = truckType;
    result['suitableFor'] = suitableFor;
    result['price'] = price;
    result['mileCharge'] = mileCharge;

    json['results'].push(result);

  }

  await browser.close();

  res.send(json);

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
  TotalCost.remove({}, function(error, cost) {
    if (error)
    res.send(error);

    // then replace with new cost
    var totalCost = new TotalCost();

    totalCost.total = req.body.total;
    totalCost.storage = req.body.storage;
    totalCost.truck = req.body.truck;
    totalCost.unitSize = req.body.unitSize;
    totalCost.truckType = req.body.truckType;

    // update distributed contributions
    Log.count({}, function (error2, count) {

      var numPeople = count;
      var contribution = parseFloat(totalCost.total) / numPeople;

      // Log.updateMany({}, {$set: {contribution: req.body.total / numPeople}})
      Log.updateMany({}, {
        $set: {
          contribution: contribution
        }
      }, {
        multi: true
      },
      function(error3, result) {
        if (error3)
        res.send(error3);

        totalCost.save(function(e) {
          if (e)
          res.send(e);
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
    if (err) res.send(err);
    res.send('Log successfully updated!');
  });
});

router.get('/delete', function(req, res){
  var id = req.query.id;
  Log.find({_id: id}).remove().exec(function(err, log) {
    if(err) res.send("error " + err)

    // update contributions here
    TotalCost.find({}, function(err, costs) {
      if (err) res.send("error " + err);

      var totalCost = costs[0].total;
      // update distributed contributions
      Log.count({}, function (err, count) {
        console.log('count is' + count);

        if (count > 0) {
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
            console.log('deleted')
            res.send('Log successfully deleted!');
          })
        }
        else res.send('Log successfully deleted!');
      });
    });
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
