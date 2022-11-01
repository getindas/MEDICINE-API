const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const router = new express.Router()

router.get('/', async (req, res) => {
    res.status(201).json({ status: 'success', message: 'Assalamualaikum' })
})


// user registration; user information will be given through body;
router.post('/signup', async (req, res) => {
    const user = new User({
        ...req.body
    })

    try {
        const registeredUser = await User.find({ phone: req.body.phone })

        if (registeredUser.length != 0) {
            return res.status(409).json({ status: 'error', message: 'Phone number already registered' })
        }

        await user.save()
        res.status(201).json({ status: 'success', message: user })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


// login the general users; authentication token will be provided to the registered user to use
// the features
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // toJSON is called into user implicitly which returns the selected properties
        res.json({ status: 'success', message: { user, token } })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//update user's profile
router.patch('/users/update-profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['userName', 'phone', 'password', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({ status: 'error', message: 'Invalid updates' })
    }

    try {
        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({ status: 'error', message: e.message })
        }

        updates.forEach((update) => user[update] = req.body[update]) //we are accepting some specified fields to update
        await user.save()
        res.send({ status: 'success', message: user })
    } catch (e) {
        res.status(400).json({ status: 'error', message: e.message })
    }
})


//log out user from current session
router.post('/users/logout', auth, async (req, res) => {
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
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.json({ status: 'success', message: 'Logged out from all devices' })
    } catch (e) {
        res.status(500).json({ status: 'error', message: e.message })
    }
})


module.exports = router