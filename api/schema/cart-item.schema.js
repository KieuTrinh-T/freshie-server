const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        required: true,
    },
    date_added: {
        type: Date,
        default: Date.now,
    }

});
var cartItem = mongoose.model('CartItem', cartItemSchema, 'cart_items');
module.exports = cartItem;