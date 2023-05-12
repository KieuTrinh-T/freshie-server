'use strict'

const express = require('express')
const { getAllProducts, getProduct, getProductByCategory, getProductByBrand, filterProduct, addProduct, updateProduct } = require('../models/product.model')
const router = express.Router()

router
    .get('/', async(req, res) => {
        await filterProduct(req, res)
    })
    .get('/:id', async(req, res) => {
        await getProduct(req, res)
    })
    .get('/categories/:category_id', async(req, res) => {
        await getProductByCategory(req, res)
    })
    .get('/brands/:brand_id', async(req, res) => {
        await getProductByBrand(req, res)
    })
    .post('/', async(req, res) => {
        await addProduct(req, res)
    })
    .put('/:id', async(req, res) => {
        await updateProduct(req, res)
    })



module.exports = router