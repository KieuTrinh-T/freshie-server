const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    subtotal: {
        type: Number,
    },
    shipping: {
        type: Number,
    },
    tax: {
        type: Number,

    },
    total: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date_ordered: {
        type: Date,
        default: Date.now,
    },
})

orderSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

var Order = mongoose.model('Order', orderSchema, 'orders');
module.exports = Order;