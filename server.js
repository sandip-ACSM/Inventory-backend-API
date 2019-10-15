const http = require('http');
const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const supplierRoutes = require('./api/routes/suppliers');
const customerRoutes = require('./api/routes/customers');


mongoose.connect('mongodb://127.0.0.1/inventory-api-db',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/customers', customerRoutes);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);
console.log('Server is running on localhost:3000')