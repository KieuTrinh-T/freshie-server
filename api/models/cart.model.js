const mongoose = require('mongoose');
const Cart = require('../schema/cart.schema');
const Product = require('../schema/product.schema');

const getAllCart = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        const cart = await Cart.find({}).populate({
            path: 'cartItems',
            populate: {
                path: 'product',
                select: { 'product_name': 1, 'price': 1, 'original_price': 1, 'thumb': 1 }
            }
        })
        return res.status(200).json(cart)

    } catch (err) {
        return res.status(500).json(err)
    }
}

const loadCart = async(req, res) => {

    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        const cart = await Cart.findOne({ user_id: req.params.user_id }).populate({
            path: 'cartItems',
            populate: {
                path: 'product',
                select: { 'product_name': 1, 'price': 1, 'original_price': 1, 'thumb': 1 }
            }
        })
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(500).json(err)
    }
}
const addToCart = async(req, res) => {
    const quantity = Number.parseInt(req.body.quantity)
    const productId = req.body.product_id
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        var cart = await Cart.findOne({ user_id: req.params.user_id })

        if (cart) {
            //cart exists for user
            let itemIndex = cart.cartItems.findIndex(p => p.product === productId)
            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                console.log('product exists in the cart, update the quantity = ', quantity)
                let productItem = cart.cartItems[itemIndex]
                const product = await Product.findById(productId)
                cart.subTotal += product.price * (quantity - productItem.quantity)
                productItem.quantity = quantity
                cart.cartItems[itemIndex] = productItem

            } else {
                //product does not exists in cart, add new item
                console.log('product does not exists in cart, add new item')
                cart.cartItems.push({ product: productId, quantity })
                const product = await Product.findById(productId)
                cart.subTotal += product.price * quantity
            }

            console.log(cart)
            cart = await cart.save()
            return res.status(201).send(cart)
        } else {
            console.log(mongoose.Types.ObjectId.isValid(productId))
                //no cart for user, create new cart
            const newCart = await Cart.create({
                user_id: req.params.user_id,
                cartItems: [{ product: productId, quantity }],
            })
            return res.status(201).send(newCart)
        }

    } catch (err) {
        return res.status(500).send(err.message)
    }
}
const removeFromCart = async(req, res) => {
    const product_id = req.body.product_id
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        var cart = await Cart.findOne({ user_id: req.params.user_id })
        if (!cart) {
            return res.status(404).send('Cart not found')
        } else {
            if (cart.cartItems.findIndex(p => p.product._id.toString() === product_id.toString()) === -1) {
                return res.status(404).send('Product not found in cart')
            } else {
                const product = await Product.findById(product_id)
                cart.subTotal -= product.price * cart.cartItems.find(p => p.product._id.toString() === product_id.toString()).quantity
                cart.cartItems = cart.cartItems.filter(p => p.product._id.toString() !== product_id.toString())
                cart = await cart.save()
                return res.status(201).send(cart)
            }
        }

    } catch (err) {
        return res.status(500).send(err.message)
    }
}
module.exports = {
    loadCart,
    addToCart,
    getAllCart,
    removeFromCart
}