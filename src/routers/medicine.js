const express = require('express')
const auth = require('../middlewares/auth')
const Medicine = require('../models/admin/medicine')
const router = new express.Router()


//get all the medicines to the user home page
router.get('/medicines', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find() //find all the medicines
        
        if (medicines.length == 0) {
            return res.status(404).json({ status: 'error', message: 'You do not have any medicine' })
        }
        
        res.status(200).json({ status: 'success', message: medicines })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})

module.exports = router