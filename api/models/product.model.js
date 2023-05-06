const { convertArrayResult } = require('../../utils/function');

const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Product = require('../schema/product.schema');


const getAllProducts = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        const result = await collection.find({}).toArray();
        await client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }

}
const getProduct = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        const result = await collection.findOne({ _id: new ObjectId(req.params.id) })
        console.log(result)
        client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }
}
const getProductByCategory = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        const result = await collection.find({ category_id: req.params.category_id }).toArray()
        client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }
}
const getProductByBrand = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        const result = await collection.find({
            brand_id: req.params.brand_id
        }).toArray()
        console.log(result)
        client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }
}

const search = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        const result = await collection.find({
            $text: {
                $search: req.query.search
            }
        }).toArray()
        client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }

}
const filterProduct = async(req, res) => {
    try {
        const uri = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect();
        const collection = await client.db("cosmetic").collection("products");
        let filter = req.query;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const search = req.query.search;
        let sort = {};
        if (search) {
            filter = {
                ...filter,
                product_name: {
                    $regex: search,
                }
            }
        }
        filter = {
            ...filter,
            is_deleted: 0,

        }
        if (req.query.brand_id) {
            delete filter.brand_id
            let brands = req.query.brand_id.split(',');
            filter = {
                ...filter,
                brand_id: {
                    $in: brands
                }
            }
        }

        if (req.query.min_price && req.query.max_price) {
            filter = {
                ...filter,
                price: {
                    $gte: parseInt(req.query.min_price),
                    $lte: parseInt(req.query.max_price)
                }
            }
        }
        if (req.query.min_price && !req.query.max_price) {
            filter = {
                ...filter,
                price: {
                    $gte: parseInt(req.query.min_price)
                }

            }
        }
        if (!req.query.min_price && req.query.max_price) {
            filter = {
                ...filter,
                price: {
                    $lte: parseInt(req.query.max_price)
                }
            }
        }

        if (req.query.min_rating) {
            console.log(req.query.min_rating)

            filter = {
                ...filter,
                rating_average: {
                    $gt: parseInt(req.query.min_rating)
                }
            }

        }
        if (req.query.sort_by) {
            if (req.query.sort_by == 'price_asc') {
                filter = {
                    ...filter,
                    price: 1
                }
            }
            if (req.query.sort_by == 'price_desc') {
                filter = {
                    ...filter,
                    price: -1
                }
            }

        }

        //sort
        // req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (req.query.sort) {
            sort = req.query.sort.split(",")
            if (sort[1]) {
                sortBy[sort[0]] = sort[1];
            } else {
                sortBy[sort[0]] = "asc";
            }
        }
        ["sort", "page", "limit", "search", "min_price", "max_price", "min_rating"].forEach((e) => delete filter[e]);
        const projection = {
            _id: 0,
            product_id: 1,
            product_name: 1,
            brand_id: 0,
            brand_name: 0,
            slug: 0,
            imgage_1: 0,
            image_2: 0,
            thumb: 1,
            description: 1,
            product_name: 1,
            category_id: 0,
            brand: 0,
            original_price: 1,
            price: 1,
            sold: 1,
            rating_average: 1,
            rating_count: 1,
            category_name: 0,
            inventory_num: 1
        };
        const result = await collection.find(filter, projection)
            .sort(sortBy)
            .limit(limit)
            .skip((page - 1) * limit)
            .toArray()
        client.close()
        return res.status(200).json(convertArrayResult(result))
    } catch (err) {
        return res.status(500).json(err)
    }

}
const addProduct = async(req, res) => {
    try {
        // Mongodb connection url
        const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

        // Connect to MongoDB
        mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Mess from Post: Connected to MongoDB');
        });
        let newProduct = new Product(req.body);
        newProduct = await newProduct.save();
        return res.status(200).json(newProduct)
    } catch (err) {
        return res.status(500).json(err)
    }
}
const updateProduct = async(req, res) => {
    try {
        // Mongodb connection url
        const MONGODB_URI = "mongodb+srv://trinhttk20411c:tun4eK0KBEnRlL4T@cluster0.amr5r35.mongodb.net/?retryWrites=true&w=majority";

        // Connect to MongoDB
        mongoose.connect(MONGODB_URI, { dbName: 'cosmetic' });
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        let updateFields = req.body;
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        for (let key in updateFields) {
            product[key] = updateFields[key];
            console.log(key)
        }
        product = await product.save();
        return res.status(200).json(product)
    } catch (err) {
        return res.status(500).json(err)
    }
}
module.exports = {
    getAllProducts,
    getProduct,
    getProductByCategory,
    getProductByBrand,
    filterProduct,
    search,
    addProduct,
    updateProduct
}