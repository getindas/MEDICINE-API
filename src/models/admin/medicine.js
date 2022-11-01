const mongoose = require('mongoose')


//medicineSchema stores all the available medicines and their necessary info
const medicineSchema = new mongoose.Schema({
    medicineName: {
        type: String,
        required: true,
        trim: true
    },
    strength: {
        type: Number,
        required: true,
        trim: true
    },
    unit: {
        type: String,
        required: true,
        enum: ['mg','ml']
    },
    genericName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})


//static method that finds medicine by its generic name
medicineSchema.statics.findByGeneric = async (genericName) => {
    const medicine = await Medicine.findOne({ genericName })

    if (!medicine) {
        throw new Error('Medicine not found')
    }

    return medicine
}


const Medicine = mongoose.model('Medicine', medicineSchema)

module.exports = Medicine