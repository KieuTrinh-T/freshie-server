'use strict'

const express = require('express')
const { getAllOrder, viewOrderItems, postOrder, getOrderByUser, cancelOrder, updateOrder } = require('../models/order.model')

const router = express.Router()
router
    .get('/', async(req, res) => {
        const result = await getAllOrder(req)
        res.status(200).json(result)
    })
    .get('/:user_id', async(req, res) => {
        const result = await getOrderByUser(req)
        res.status(200).json(result)
    })
    .get('/:id', async(req, res) => {
        const result = await viewOrderItems(req)
        console.log(result)

        res.status(200).json(result)
    })
    .post('/', async(req, res) => {
        const result = await postOrder(req)
        console.log(result)

        res.status(200).json(result)
    })
    .post('/', async(req, res) => {
        const result = await postOrder(req)
        console.log(result)
        res.status(200).json(result)
    })
    .put('/:id/cancel', async(req, res) => {
        await cancelOrder(req, res)
    })
    .put('/:id', async(req, res) => {
        await updateOrder(req, res)
    })



module.exports = router