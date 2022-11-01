const mongoose = require('mongoose')

//nested schema under orderSchema
const medicineDetails = new mongoose.Schema({
    medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Medicine'
    },
    quantity: {
        type: Number,
        required: true,
        trim: true
    }
})

//orderSchema that contains the necessary info
const orderSchema = new mongoose.Schema({
    orderNo: {
        type: Number,
        required: true,
        unique: true
    },
    orderStatus: {
        type: String,
        required: false,
        default: 'Pending',
        enum: ['Accepted', 'Pending', 'Delivered']
    },
    orderDetails: [medicineDetails], //contains multiple orders
    subTotal: {
        type: Number,
        required: true
    },
    //refer to the User collection to access the fields of that collection
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order