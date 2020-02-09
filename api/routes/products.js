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

var addElement_obj = (query_obj, query_str_key, query_str_value) => {
    if (query_str_value) {
        if (typeof query_str_value == "string") {
            // For case insensitive search in case of string
            query_obj[query_str_key] = {$regex:"^"+query_str_value+"$", $options:"i"}
        } else {
            query_obj[query_str_key] = query_str_value
        }
    } 
    return query_obj
}
//Endpoint example: /products?u_sell={"lt": 150, "gt": 30}
var addFilteredElement_obj = (query_obj, query_str_key, query_str_value) => {
    if (query_str_value) {
        var entity = JSON.parse(query_str_value)
        if (entity.lt && entity.gt){
            query_obj[query_str_key] = {$lt: entity.lt, $gt: entity.gt}
        } else if (entity.lt && entity.gte){
            query_obj[query_str_key] = {$lt: entity.lt, $gte: entity.gte}
        } else if (entity.lte && entity.gt){
            query_obj[query_str_key] = {$lte: entity.lte, $gt: entity.gt}
        } else if (entity.lte && entity.gte){
            query_obj[query_str_key] = {$lte: entity.lte, $gte: entity.gte}
        }
    }
    return query_obj
}

router.get("/", (req, res, next) => {
    if (Object.keys(req.query).length === 0){
        var product_res = Product.find()
    } else {
        var query_obj = {}
        query_obj = addElement_obj(query_obj, 'product_code', req.query.product_code)
        query_obj = addElement_obj(query_obj, 'name', req.query.name)
        query_obj = addElement_obj(query_obj, 'category', req.query.category)
        query_obj = addElement_obj(query_obj, 'supplier', req.query.supplier)
        query_obj = addFilteredElement_obj(query_obj, 'u_buy', req.query.u_buy)
        query_obj = addFilteredElement_obj(query_obj, 'u_sell', req.query.u_sell)
        var product_res = Product.find(query_obj)
    }
    product_res
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product_code: doc.product_code,
                        name: doc.name,
                        category: doc.category,
                        description: doc.description,
                        supplier: doc.supplier,
                        u_sell: doc.u_sell,
                        u_buy: doc.u_buy,
                        u_measure: doc.u_measure,
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
        product_code: req.body.product_code,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        supplier: req.body.supplier,
        u_sell: req.body.u_sell,
        u_buy: req.body.u_buy,
        u_measure: req.body.u_measure,
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    _id: result._id,
                    product_code: result.product_code,
                    name: result.name,
                    category: result.category,
                    description: result.description,
                    supplier: result.supplier,
                    u_sell: result.u_sell,
                    u_buy: result.u_buy,
                    u_measure: result.u_measure,
                }
            });
        })
        .catch(http_error_500);
});


router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
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