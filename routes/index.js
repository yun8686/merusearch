var express = require('express');
var router = express.Router();
var merkari = require("../modules/merkari.js");

/* GET home page. */
router.get('/', async (req, res, next)=>{
  const keyword = req.query.keyword;
  const price_min = req.query.price_min;
  const price_max = req.query.price_max;
  const results = ([
    await merkari.runSearch({
      keyword: keyword, sort_order:"price_asc", "status_on_sale":1,
      price_min, price_max,
    }),
    await merkari.runSearch({
      keyword: keyword, sort_order:"price_asc", "status_trading_sold_out":1,
      price_min, price_max,
    }),
    await merkari.runSearch({
      keyword: keyword, sort_order:"price_desc", "status_on_sale":1,
      price_min, price_max,
    }),
    await merkari.runSearch({
      keyword: keyword, sort_order:"price_desc", "status_trading_sold_out":1,
      price_min, price_max,
    }),
  ]);
  const onsale_min = results[0].filter((v,i)=>i<3);
  const soldout_min = results[1].filter((v,i)=>i<3);
  const onsale_max = results[2].filter((v,i)=>i<3);
  const soldout_max = results[3].filter((v,i)=>i<3);
  await res.render('index', {
    title: 'Express',  result: results[1],
    keyword: keyword,
    price_min, price_max,
    onsale_min,onsale_max,soldout_min,soldout_max,
  });
});

module.exports = router;
