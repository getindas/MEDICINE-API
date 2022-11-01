const express = require('express')
const auth = require('../../middlewares/authAdmin')
const Medicine = require('../../models/admin/medicine')
const router = new express.Router()


//retrieve all the available medicines to the admin user home page 
router.get('/admin/medicines', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find() //find all the documents from Medicine collection
        res.status(200).json({ status: 'success', message: medicines })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//add medicines to the medicine inventory list
router.post('/admin/add-medicine', auth, async (req, res) => {
    const medicine = new Medicine({
        ...req.body //ES6 syntax; fetches all the key value pairs from the request body
    })
    try {
        const registeredMedicine = await Medicine.find({
            medicineName: req.body.medicineName,
            strength: req.body.strength,
            unit: req.body.unit
        }) //finds if there is any medicine registered in the list that is to be added again

        //if any medicine found that is already added and trying to be inserted again, just
        // throws an error
        if (registeredMedicine.length != 0) {
            return res.status(409).json({ status: 'error', message: 'Medicine is already in the list' })
        }

        await medicine.save()
        res.status(201).json({ status: 'success', message: 'Successfully inserted' })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//update an existing medicine saved in the inventory list
router.post('/admin/update-medicine', auth, async (req, res) => {
    try {
        const registeredMedicine = await Medicine.findByIdAndUpdate(req.body._id,
            {
                medicineName: req.body.medicineName,
                strength: req.body.strength,
                strength: req.body.strength,
                genericName: req.body.genericName,
                manufacturer: req.body.manufacturer,
                price: req.body.price
            }, { new: true }) //we are taking the whole body though all the fields do not need to be
        // changed; { new: true } returns the modified medicine

        res.status(200).json({ status: 'success', message: registeredMedicine })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//removes a specific medicine from the medicine inventory list
router.post('/admin/remove-medicine', auth, async (req, res) => {
    try {
        const registeredMedicine = await Medicine.findByIdAndDelete(req.body._id) //findByIdAndDelete
        // just finds a documents by it's id and then delete it instantly
        res.status(200).json({ status: 'success', message: registeredMedicine })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})

module.exports = router