const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    }

});
var OrderItem = mongoose.model('OrderItem', orderItemSchema, 'order_items');
module.exports = OrderItem;