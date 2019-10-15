const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    company: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { type: Number, required: true },
    city: { type: String, required: true },
    contact_person: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    fax: { type: String, required: true }
});

module.exports = mongoose.model('log', logSchema);