const jwt = require('jsonwebtoken')
const User = require('../models/user')

//middleware; that is called before accessing the database; Bearer authentication token is added
//to complete the process
const auth = async (req, res, next) => {
    try {
        console.log("Testing");
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log("Testing 1");
        console.log("Toeknnnnn U::" + token);
        const decoded = jwt.verify(token, 'thisprojectisfromisdlab') //json web token encode the
        // string to make auth token
        console.log("Testing2");
        console.log("Toeknnnnn U::" + token);
        console.log("decoded U::" + decoded);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error({ error: 'User not found' })
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).json({ error: 'Please authenticate User' })
    }
}

module.exports = auth