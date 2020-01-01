var express = require('express');
var router = express.Router();
var merkari = require("../modules/merkari.js");

/* GET home page. */
router.get('/', async (req, res, next)=>{
  const keyword = req.query.keyword;
  const price_min = req.query.price_min;
  const price_max = req.query.price_max;
  const condition_all = req.query.condition_all;
  const item_condition_id = [];
  const item_condition_obj = {};
  for(var i=1;i<=6;i++){
    const val = req.query["item_condition_id_"+i];
    if(val){
      item_condition_id[i] = 1;
      item_condition_obj["item_condition_id["+i+"]"] = 1;
    }
  }
  console.log("item_condition_id", item_condition_id);

  const price_asc = req.query.price_asc;
  const price_asc_sold = req.query.price_asc_sold;
  const price_desc = req.query.price_desc;
  const price_desc_sold = req.query.price_desc_sold;

  const results = ([
    price_asc?
      await merkari.runSearch(Object.assign({
        keyword: keyword, sort_order:"price_asc", "status_on_sale":1,
        price_min, price_max,
        item_condition_id
      },item_condition_obj)):[],
    price_asc_sold?
      await merkari.runSearch(Object.assign({
        keyword: keyword, sort_order:"price_asc", "status_trading_sold_out":1,
        price_min, price_max,
      },item_condition_obj)):[],
    price_desc?
      await merkari.runSearch(Object.assign({
        keyword: keyword, sort_order:"price_desc", "status_on_sale":1,
        price_min, price_max,
      },item_condition_obj)):[],
    price_desc_sold?
      await merkari.runSearch(Object.assign({
        keyword: keyword, sort_order:"price_desc", "status_trading_sold_out":1,
        price_min, price_max,
      },item_condition_obj)):[],
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
    condition_all, item_condition_id,
    price_asc,price_desc,price_asc_sold,price_desc_sold
  });
});

module.exports = router;
