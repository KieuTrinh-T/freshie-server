const { convertArrayResult } = require('../../utils/function');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const Order = require('../schema/order.schema');
const OrderItem = require('../schema/order-item.schema');
require('../schema/product.schema')

const mongoose = require('mongoose');

const getAllOrder = async(req) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("orders");
        const query = req.query
        console.log(req.query)

        const result = await collection.find(query).sort({ 'dateOrdered': -1 }).toArray();
        await client.close()
        return convertArrayResult(result)
    } catch (err) {
        return err
    }

}


const getOrderByUser = async(req) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        const user_id = req.params.user_id
        const result = await Order.find({ user: user_id })
        return convertArrayResult(result)
    } catch (err) {
        return err
    }
}
const viewOrderItems = async(req) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        mongoose.connect(uri, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from View: Connected to MongoDB');
        });
        const order = await Order.findById(req.params.id).populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: { 'product_name': 1, 'price': 1, 'original_price': 1, 'thumb': 1 }
            }
        })
        console.log(req.params.id)
        return order

    } catch (err) {
        return err
    }
}
const postOrder = async(req) => {
    try {
        // Mongodb connection url
        const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

        // Connect to MongoDB
        mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from Post: Connected to MongoDB');
        });
        const ordrItemIds = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product,
            })
            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }))
        const orderItemsIdsResolved = await ordrItemIds;
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async orderItemId => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        }))
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            subtotal: totalPrices.reduce((a, b) => a + b, 0),
            shipping: req.body.shipping,
            tax: req.body.tax,
            total: totalPrices.reduce((a, b) => a + b, 0) + req.body.shipping + req.body.tax,
            user: req.body.user,
        })
        order = await order.save();
        return order
    } catch (err) {
        return err
    }
}
const cancelOrder = async(req, res) => {
    // Mongodb connection url
    const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

    // Connect to MongoDB
    mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
    mongoose.connection.on('connected', () => {
        console.log('Mess from Post: Connected to MongoDB');
    });
    let order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).send('The order with the given ID was not found.');
    }
    order.status = 'Cancelled';
    order = await order.save();
    return res.status(200).send(order);
}
const updateOrder = async(req, res) => {
    // Mongodb connection url
    const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

    // Connect to MongoDB
    mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
    mongoose.connection.on('connected', () => {
        console.log('Mess from Post: Connected to MongoDB');
    });
    let order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).send('The order with the given ID was not found.');
    }
    updateFields = req.body;
    for (const field in updateFields) {
        order[field] = updateFields[field];
    }
    console.log(order)
    order = await order.save();
    return res.status(200).send(order);
}


module.exports = {
    getAllOrder,
    getOrderByUser,
    viewOrderItems,
    postOrder,
    cancelOrder,
    updateOrder,
}