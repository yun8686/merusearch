const puppeteer = require('puppeteer');

module.exports = {
  runSearch: runSearch,
};

let page, browser;

async function getBrowserPage () {
  const isDebug = process.env.NODE_ENV !== 'production'

  const launchOptions = {
    headless: isDebug ? false : true,
    headless: isDebug ? true : true,
    args: ['--no-sandbox']
  }

  browser = await puppeteer.launch(launchOptions)
  return browser.newPage()
}
function makeParam(obj){
  let param = "?";
  Object.keys(obj).forEach(key=>{
    param += "&" + key + "=" + encodeURIComponent(obj[key])
  });
  return param;
}
//runSearch().then(v=>process.exit());

async function runSearch(params){
  if (!page) {
    page = await getBrowserPage()
  }
  await page.goto(
    'https://www.mercari.com/jp/search/'+makeParam(Object.assign({
      "sort_order":"",
      "keyword":"",
      "category_root": "",
      "brand_name": "",
      "brand_id":"",
      "size_group":"",
      "price_min":"",
      "price_max":"",
    },params))
  );
  console.log("url",
  'https://www.mercari.com/jp/search/'+makeParam(Object.assign({
    "sort_order":"",
    "keyword":"",
    "category_root": "",
    "brand_name": "",
    "brand_id":"",
    "size_group":"",
    "price_min":"",
    "price_max":"",
  },params))

  );
  const list = await page.evaluate((in_selectors) => {
    const list = [];
    document.querySelectorAll('.items-box').forEach(v=>{
      const name = v.querySelector('.items-box-name').innerText;
      const price = v.querySelector('.items-box-price').innerText;
      const sold = v.querySelector('.item-sold-out-badge');
      const image = v.querySelector('.items-box-photo img').dataset.src;
      list.push({
        name: name, price:price, sold: !!sold,
        priceNum: price.replace(/[^0-9]/g, '')-0,
        image:image,
      });
    });
    return list;
  });
  return list;
//  loadPromise = page.waitForNavigation();
}
