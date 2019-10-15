const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product_model.js");

var http_error_500 = err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
}

var price_filter = (query_str_price, Product) => {
    var price = JSON.parse(query_str_price)
    if (price.lt && price.gt){
        product_res = Product.find({price: {$lt: price.lt, $gt: price.gt}})
    } else if (price.lt && price.gte){
        product_res = Product.find({price: {$lt: price.lt, $gte: price.gte}})
    } else if (price.lte && price.gt){
        product_res = Product.find({price: {$lte: price.lte, $gt: price.gt}})
    } else if (price.lte && price.gte){
        product_res = Product.find({price: {$lte: price.lte, $gte: price.gte}})
    }
    return product_res
}

router.get("/", (req, res, next) => {
    query_key_list = Object.keys(req.query)
    var product_res = undefined;

    if (query_key_list.length === 0){
        product_res = Product.find()
    } else {
        if (req.query.name) {
            product_res = Product.find({name: req.query.name})
        }
        if (req.query.price) {
            product_res = price_filter(req.query.price, Product)
        }
    }
    product_res
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                    };
                })
            };
            res.status(200).json(response);
            })
        .catch(http_error_500);
});


router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
        }
      });
    })
    .catch(http_error_500);
});


router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
//   Product.find({ name: req.params.productId})
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            product: doc,
        });
      } else {
        res.status(404).json({ 
          message: "No valid entry found for provided ID" 
        });
      }
    })
    .catch(http_error_500);
});


router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
      });
    })
    .catch(http_error_500);
});


router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted',
      });
    })
    .catch(http_error_500);
});

module.exports = router;