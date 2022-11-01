const express = require('express')
const moment = require('moment')
const auth = require('../../middlewares/authAdmin')
const Order = require('../../models/order')
const router = new express.Router()

//show all the orders those are still pending to the admin
router.get('/admin/orders/pending', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Pending' }).populate('owner').exec() //finds
        // the pending orders from documents and populate the document by it's owner field;

        //if the retrieved orders length is zero that means no such order is available
        if (orders.length == 0) {
            return res.status(404).json({ status: 'error', message: 'No pending order available' })
        }

        const response = []
        orders.forEach(order => {
            const orderId = order._id
            const ownerId = order.owner._id
            const orderNo = order.orderNo
            const customerName = order.owner.userName
            const dateTime = moment(order.createdAt).format('DD/MM/YYYY hh:mm a')
            const subTotal = order.subTotal
            const obj = { orderId, ownerId, orderNo, customerName, dateTime, subTotal }
            response.push(obj) //manipulating the response data
        })

        res.status(200).json({ status: 'success', message: response })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//show all the orders those are still accepted to the admin
router.get('/admin/orders/accepted', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Accepted' }).populate('owner').exec()

        if (orders.length == 0) {
            return res.status(400).json({ status: 'error', message: 'No accepted order available' })
        }

        const response = []
        orders.forEach(order => {
            const orderId = order._id
            const ownerId = order.owner._id
            const orderNo = order.orderNo
            const customerName = order.owner.userName
            const dateTime = moment(order.createdAt).format('DD/MM/YYYY hh:mm a')
            const subTotal = order.subTotal
            const obj = { orderId, ownerId, orderNo, customerName, dateTime, subTotal }
            response.push(obj)
        })

        res.status(200).json({ status: 'success', message: response })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//show all the orders those are still delivered to the admin
router.get('/admin/orders/delivered', auth, async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: 'Delivered' }).populate('owner').exec()

        if (orders.length == 0) {
            return res.status(400).json({ status: 'error', message: 'No delivered order available' })
        }

        const response = []
        orders.forEach(order => {
            const orderId = order._id
            const ownerId = order.owner._id
            const orderNo = order.orderNo
            const customerName = order.owner.userName
            const dateTime = moment(order.createdAt).format('DD/MM/YYYY hh:mm a')
            const subTotal = order.subTotal
            const obj = { orderId, ownerId, orderNo, customerName, dateTime, subTotal }
            response.push(obj)
        })

        res.status(200).json({ status: 'success', message: response })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//get the details of a selected order that admin has
router.get('/admin/orders/:orderNo', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ orderNo: req.params.orderNo })
            .populate('owner medicineId').exec() //populating multiple fields here (owner medicineId)
        // to access the data of other collection

        //if no order is returned means no such order found
        if (!order) {
            res.status(404).json({ status: 'error', message: 'Order not found' })
        }

        const orderNo = order.orderNo
        const customerName = order.owner.userName
        const address = order.owner.address
        const medicineDetails = order.orderDetails
        const dateTime = moment(order.createdAt).format('DD/MM/YYYY hh:mm a')
        const subTotal = order.subTotal
        const response = { orderNo, customerName, medicineDetails, dateTime, subTotal, address } //manipulates 
        //the response data

        res.status(200).json({ status: 'success', message: response })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//used to change the status of an order; like from Accepted to Delivered or from Pending to Accepted
router.post('/admin/orders/change-status', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ orderNo: req.body.orderNo, orderStatus: req.body.statusFrom })

        //if no order is returned means no such order found
        if (!order) {
            res.status(404).json({ status: 'error', message: 'Order not found' })
        }

        order.orderStatus = req.body.statusTo //sets the new status admin wants to do
        order.save()
        res.status(200).json({ status: 'success', message: 'Order status changed' })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})

module.exports = router