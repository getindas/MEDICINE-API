const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/medicine", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})