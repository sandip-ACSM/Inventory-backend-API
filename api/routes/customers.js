const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Customer = require("../models/customer_model.js");

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

router.get("/", (req, res, next) => {
    if (Object.keys(req.query).length === 0){
        var customer_res = Customer.find()
    } else {
        var query_obj = {}
        query_obj = addElement_obj(query_obj, 'customer_name', req.query.customer_name)
        query_obj = addElement_obj(query_obj, 'city', req.query.city)
        query_obj = addElement_obj(query_obj, 'email', req.query.email)
        var customer_res = Customer.find(query_obj)
    }
    customer_res
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                customers: docs.map(doc => {
                    return {
                        _id: doc._id,
                        customer_code: doc.customer_code,
                        customer_name: doc.customer_name,
                        city: doc.city,
                        description: doc.description,
                        customer: doc.customer,
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
    const customer = new customer({
        _id: new mongoose.Types.ObjectId(),
        customer_name: req.body.customer_name,
        address: req.body.address,
        zipcode: req.body.zipcode,
        city: req.body.city,
        contact_person: req.body.contact_person,
        phone: req.body.phone,
        email: req.body.email,
        fax: req.body.fax,
    });
    customer
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created customer successfully",
                createdcustomer: {
                    _id: result._id,
                    customer_name: result.customer_name,
                    address: result.address,
                    zipcode: result.zipcode,
                    city: result.city,
                    contact_person: result.contact_person,
                    phone: result.phone,
                    email: result.email,
                    fax: result.fax,
                }
            });
        })
        .catch(http_error_500);
});


router.get("/:customerId", (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    customer: doc,
                });
            } else {
                res.status(404).json({ 
                message: "No valid entry found for provided ID" 
                });
            }
        })
        .catch(http_error_500);
});

router.patch("/:customerId", (req, res, next) => {
    const id = req.params.customerId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Customer.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'customer updated',
            });
        })
        .catch(http_error_500);
});

router.delete("/:customerId", (req, res, next) => {
    const id = req.params.customerId;
    Customer.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Customer deleted',
            });
        })
        .catch(http_error_500);
});

module.exports = router;