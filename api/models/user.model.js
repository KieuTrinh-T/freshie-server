const { query } = require('express');
const { convertArrayResult, convertObjectResult, convertAuthenResult } = require('../../utils/function');
const User = require('../schema/user.schema');
// const jwt = require('jsonwebtoken');
let ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const signUp = async(req) => {
    // Mongodb connection url
    const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

    // Connect to MongoDB
    mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });


    try {
        let user = new User({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })
        user.setPassword(req.body.password);
        user = await user.save();

        return {
            status: 200,
            message: "Sign up successfully",
            value: user
        }
    } catch (error) {
        return error
    }

}

const signIn = async(req, res) => {

    // Mongodb connection url
    const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

    // Connect to MongoDB
    mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });

    let message = "";
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
        message = "Username is not correct";
        res.status(500).json({ message: message });

    }
    if (!user.validPassword(req.body.password)) {
        message = "Password is not correct";
        res.status(500).json({ message: message });
    } else if (user.validPassword(req.body.password)) {
        message = "Sign in successfully";
        res.status(200).json({ message: message, value: user });
    } else {
        res.status(500).json({ message: message });
    }
}

const getUserById = async(req) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("users");
        const result = await collection.findOne({ _id: new ObjectId(req.params.id) })
        await client.close()
        return convertObjectResult(result)
    } catch (err) {
        return err
    }
}
const filterUser = async(req) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("users");
        let query = {}
        if (req.query.username) {
            query = {
                ...query,
                username: req.query.username
            }
        }
        if (req.query.email) {
            query = {
                ...query,
                email: req.query.email
            }
        }
        if (req.query.phone) {
            query = {
                ...query,
                phone: req.query.phone
            }
        }
        const result = await collection.find(query).toArray();
        await client.close()
        return convertArrayResult(result)
    } catch (err) {
        return err
    }
}
const updateUser = async(req) => {
    // Mongodb connection url
    const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
    // Connect to MongoDB
    mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
    mongoose.connection.on('connected', () => {
        console.log('Mess from function signIn: Connected to MongoDB');
    });
    await User.updateOne({ _id: new ObjectId(req.params.id) }, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            is_active: req.body.is_active
        }
    })
    const user = await User.findOne({ _id: new ObjectId(req.params.id) })
    return user

}



module.exports = {
    signUp,
    signIn,
    getUserById,
    filterUser,
    updateUser
}