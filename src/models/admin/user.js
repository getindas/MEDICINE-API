const mongoose = require('mongoose')
const userValidator = require('../../validators/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('../../validators/user')


//userSchema that stores all info for admin user
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: false,
        trim: true,
        lowercase: true,
        validate: userValidator.emailValidator
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
        // validate(value) {
        //     if (value.toLowerCase().includes('password')) {
        //         throw new Error('Password cannot contain "password"')
        //     }
        // }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


// manipulates the userSchema; when the userSchema is called to send/stringify;
// toJSON decides what properties we want to expose
userSchema.methods.toJSON = function () {
    const user = this
    // 'toObject()' provided by Mongoose; return a raw object with user data attached
    const userObject = user.toObject();

    // deletes the password and tokens properties from userObject
    delete userObject.createdAt
    delete userObject.updatedAt
    delete userObject.password
    delete userObject.tokens

    return userObject
}


// generates authentication token at the moment of user registration and login and store into tokens array
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisprojectisfromisdlab')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


// executes before saving
userSchema.pre('save', async function (next) {
    const user = this

    //  hashes the plain text password
    try {
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }

    } catch (e) {
        throw new Error(e.message)
    }

    next()
})


// finds the user at login moment 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('User is not registered')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('User password is incorrect') // error message not showing
    }

    return user
}


const User = mongoose.model('Admin_User', userSchema)

module.exports = User