const express = require('express')
const User = require('../../models/admin/user')
const auth = require('../../middlewares/authAdmin')
const router = new express.Router()


// authenticated user can create a admin user; all the information will be given through body;
router.post('/admin/create-user', auth, async (req, res) => {
    const user = new User({
        ...req.body
    })

    try {
        const registeredUser = await User.find({ email: req.body.email }) //finds all the admin
        // users by the specified email

        //checks if any user is inserted in the lit before
        if (registeredUser.length != 0) {
            return res.status(409).json({ status: 'error', message: 'Admin already registered' })
        }

        await user.save()
        res.status(201).json({ status: 'success', message: user })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//login router enables admin user to login to their account; authentication token will be generated
router.post('/admin/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // toJSON is called into user implicitly which returns the selected properties
        res.json({ status: 'success', message: { user, token } })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//router for admin account logout from current device
router.post('/admin/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).json({ status: 'success', message: 'Logged out from current device' })
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message })
    }
})


// Logout user from all session
router.post('/admin/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.json({ status: 'success', message: 'Logged out from all devices' })
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message })
    }
})


module.exports = router