const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_code: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    supplier: { type: String },
    u_buy: { type: Number },
    u_sell: { type: Number },
    u_measure: { type: String }
});

module.exports = mongoose.model('Product', productSchema);