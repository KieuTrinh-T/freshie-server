'use strict'

const express = require('express')
const { getAllOrder, viewOrderItems, postOrder, getOrderByUser, cancelOrder, updateOrder } = require('../models/order.model')

const router = express.Router()
router
    .get('/', async(req, res) => {
        await getAllOrder(req, res)
    })
    .get('/user/:id', async(req, res) => {
        await getOrderByUser(req, res)

    })
    .get('/:id', async(req, res) => {
        await viewOrderItems(req, res)

    })
    .post('/', async(req, res) => {
        await postOrder(req, res)

    })
    .put('/:id/cancel', async(req, res) => {
        await cancelOrder(req, res)
    })
    .put('/:id', async(req, res) => {
        await updateOrder(req, res)
    })



module.exports = router