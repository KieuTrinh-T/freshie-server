const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
const cartSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: {
            type: Number,
            required: true,
        },

    }],
    is_active: {
        type: Boolean,
        default: true,
    },
    modified_date: {
        type: Date,
        default: Date.now,
    },
    subTotal: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

cartSchema.methods.countSubTotal = function(price) {
    let subTotal = 0;
    this.cartItems.forEach(item => {
        subTotal += item.quantity * price;
    });
    this.subTotal = subTotal;
}
cartSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
});
var Cart = mongoose.model('Cart', cartSchema, 'carts');
module.exports = Cart;
