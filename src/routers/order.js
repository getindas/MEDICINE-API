const express = require('express')
const Order = require('../models/order')
const moment = require('moment')
const auth = require('../middlewares/auth')
const router = new express.Router()


//place an order by user panel;
router.post('/order', auth, async (req, res) => {
    console.log("Testing");
    const order = new Order({
        ...req.body,
        owner: req.user._id //owner id is taken from the token
    })
    try {
        order.orderNo = await Order.countDocuments() + 1 //count the previous total numbers of
        // orders and assign a new value
        await order.save()
        res.status(201).json({ status: 'success', message: 'Order placed for acceptance' })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//read the orders that are accepted by admin
router.get('/orders/accepted', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Accepted', owner: req.user._id }) //find
        // the orders that belongs to the logged in user

        //if the orders length is zero, means there is no accepted orders to show 
        if (orders.length == 0) {
            return res.status(404).json({ status: 'error', message: 'You do not have any accepted order' })
        }

        res.status(200).json({ status: 'success', message: orders })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//read the orders that are pending by admin
router.get('/orders/pending', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Pending', owner: req.user._id })

        if (orders.length == 0) {
            return res.status(404).json({ status: 'error', message: 'You do not have any pending order' })
        }

        res.status(200).json({ status: 'success', message: orders })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//read the orders that are delivered by admin
router.get('/orders/delivered', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Delivered', owner: req.user._id })

        if (orders.length == 0) {
            return res.status(404).json({ status: 'error', message: 'You do not have any delivered order' })
        }

        res.status(200).json({ status: 'success', message: orders })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//get the details of a selected order
router.get('/orders/:orderNo', auth, async (req, res) => {
    try {
        console.log("Order testing")
        const order = await Order.findOne({ orderNo: req.params.orderNo, owner: req.user._id })
            .populate('owner medicineId').exec()

        if (!order) {
            res.status(404).json({ status: 'error', message: 'Order not found' })
        }

        const orderNo = order.orderNo
        // const customerName = order.owner.userName
        const address = order.owner.address
        const medicineDetails = order.orderDetails
        const dateTime = moment(order.createdAt).format('DD/MM/YYYY hh:mm a')
        const subTotal = order.subTotal

        const response = { orderNo, medicineDetails, dateTime, subTotal, address }
        //manipulating the response

        res.status(200).json({ status: 'success', message: response })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})

module.exports = router