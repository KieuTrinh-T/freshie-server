const mongoose = require('mongoose');
const Cart = require('../schema/cart.schema');
const Product = require('../schema/product.schema');
const e = require('express');

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

        if (req.body.cartItems) {
            let result = cart.cartItems.filter(item => {
                return req.body.cartItems.indexOf(item._id.toString()) != -1
            })
            console.log(result)
            return res.status(200).json(result)
        } else {
            console.log(cart)
            return res.status(200).json(cart)

        }
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
            cart.cartItems.forEach(element => {
                console.log(element.product.toString(), element.product)
            });
            let itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId)
            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                console.log('product exists in the cart, update the quantity = ', quantity)
                let productItem = cart.cartItems[itemIndex]
                const product = await Product.findById(productId)
                cart.subTotal += product.price * (quantity + productItem.quantity)
                productItem.quantity = quantity + productItem.quantity
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
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        if (req.body.cartItemId) {
            await emptyCart(req, res)
        } else {
            const cartItemId = req.body.cartItemId
            var cart = await Cart.findOne({ user_id: req.params.user_id })
            if (!cart) {
                return res.status(404).send('Cart not found')
            } else {
                if (!cart.cartItems.find(p => p._id.toString() === cartItemId)) {
                    return res.status(404).send('Product not found in cart')
                } else {
                    cart.cartItems = cart.cartItems.filter(p => p._id.toString() !== cartItemId)
                    const product = await Product.findById(req.body.product_id)
                    cart.subTotal -= product.price * req.body.quantity
                    cart = await cart.save()
                    return res.status(200).send(cart)
                }
            }
        }
    } catch (err) {
        return res.status(500).send(err)
    }

}
const emptyCart = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        const cart = await Cart.findByIdAndUpdate(req.params.id, { cartItems: [] })
        if (!cart) {
            return res.status(404).send('Cart not found')
        } else {
            return res.status(200).send('Cart deleted')
        }
    } catch (err) {
        return res.status(500).send(err.message)
    }
}
module.exports = {
    loadCart,
    addToCart,
    getAllCart,
    removeFromCart,
    emptyCart
}