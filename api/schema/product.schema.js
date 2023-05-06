const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    brand_id: {
        type: String,
    },
    brand_name: {
        type: String,
    },
    imgage_1: {
        type: String,
    },
    image_2: {
        type: String,
    },
    image_3: {
        type: String,
    },
    thumb: {
        type: String,
    },

    description: {
        type: String,
    },
    product_name: {
        type: String,
    },
    category_id: {
        type: String,
    },
    brand: {
        type: String,
    },
    original_price: {
        type: Number,
    },
    price: {
        type: Number,
    },
    sold: {
        type: Number,
    },
    rating_average: {
        type: Number,
    },
    rating_count: {
        type: Number,
    },
    category_name: {
        type: String,
    }
})

productSchema.set('toJSON', {
    virtuals: true,
});
var Product = mongoose.model('Product', productSchema, 'products');
module.exports = Product;