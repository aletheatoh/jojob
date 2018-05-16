const puppeteer = require('puppeteer');

async function run() {
  
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
        return document.querySelector(sel).value = '6/15/2018';
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

  return json;
}

async function getResults() {
  var results = await run();
  return results;
}

console.log(getResults());

module.exports.run = run;
