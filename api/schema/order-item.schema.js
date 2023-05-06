const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
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