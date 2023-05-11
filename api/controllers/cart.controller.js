'use strict'

const express = require('express')
const router = express.Router()
const { loadCart, addToCart, getAllCart, removeFromCart } = require('../models/cart.model')

router
    .get('/', async(req, res) => {
        await getAllCart(req, res)
    })
    .get('/:user_id', async(req, res) => {
        await loadCart(req, res)
    })
    .post('/:user_id', async(req, res) => {
        await addToCart(req, res)
    })
    .delete('/:user_id', async(req, res) => {
        await removeFromCart(req, res)
    })



module.exports = router