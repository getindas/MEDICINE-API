const jwt = require('jsonwebtoken')
const User = require('../models/admin/user')

//middleware; that is called before accessing the database; Bearer authentication token is added
//to complete the process
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisprojectisfromisdlab')//json web token encode the
        // string to make auth token
        console.log("Toeknnnnn::" + token);
        console.log("decoded::" + decoded);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error({ error: 'User not found' })
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).json({ error: 'Please authenticate here' })
    }
}

module.exports = auth