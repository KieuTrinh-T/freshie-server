const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect();

// const collection = client.db("cosmetic").collection("product_list");


const express = require('express');
const app = express()
const port = 3004
var cors = require('cors');
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI;
// use it before all route definitions
// app.use(cors({ origin: 'http://localhost:4200' }));
const allowedOrigins = ['http://localhost:4200', 'https://freshie-server-mqt8rgu0d-kieutrinh-t.vercel.app', 'http://www.freshie.live',
    'https://freshie-project.vercel.app/'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const productRouter = require('./api/controllers/product.controller')
const orderRouter = require('./api/controllers/order.controller')
const userRouter = require('./api/controllers/user.controller')
const cartRouter = require('./api/controllers/cart.controller')

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/users', userRouter)
app.use('/api/carts', cartRouter)


mongoose.set('strictQuery', false);
const connectDB = async() => {
        try {
            await mongoose.connect(uri);
            console.log('MongoDB is connected')
        } catch (err) {
            console.log(err)
        }
    }
    // app.listen(port, () => {
    //     console.log(`I am listening on port ${port}`)
    // })
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Connected to DB, I am listening on port ${port}`)
    })

})