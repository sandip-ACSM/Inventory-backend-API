const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer_name: { type: String, required: true },
    address: { type: String },
    zipcode: { type: Number },
    city: { type: String },
    contact_person: { type: String },
    phone: { type: String },
    email: { type: String },
    fax: { type: String }
});

module.exports = mongoose.model('customer', customerSchema);