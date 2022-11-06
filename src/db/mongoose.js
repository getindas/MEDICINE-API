const mongoose = require('mongoose')

//established connection with MongoDB; it requires the connection string
mongoose.connect("mongodb://localhost/medicine", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})