'use strict'

const express = require('express')
const router = express.Router()
const { signUp, signIn, getUserById, filterUser, updateUser } = require('../models/user.model')



router
    .post('/signup', async(req, res) => {
        await signUp(req, res)
    })
    .post('/signin', async(req, res) => {
        await signIn(req, res);
    })
    .get('/', async(req, res) => {
        const result = await filterUser(req)
        res.status(200).json(result)
    })
    .get('/:id', async(req, res) => {
        const result = await getUserById(req)
        res.send(result)
    })
    .put('/:id', async(req, res) => {
        const result = await updateUser(req)
        res.send(result)
    })


module.exports = router